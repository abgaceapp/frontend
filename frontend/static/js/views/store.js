import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo, numberWithCommas } from "./periodFuncs.js";

// Table functions
import { Grid, html } from "https://unpkg.com/gridjs?module";
//import "https://unpkg.com/gridjs/dist/theme/mermaid.css";



function getMetrics(db, storenum) {
  const metricRef = ref(db, `Store_Metrics/${storenum}`);

  onValue(metricRef, (snapshot) => {
    const data = snapshot.val();

    if (data != null) {
      document.querySelector("#mktshare-seltz").innerHTML = `${data["MktShare_Seltz"]}%`;
      document.querySelector("#mktshare-tea").innerHTML = `${data["MktShare_WC"]}%`;
      document.querySelector("#mktshare-wc").innerHTML = `${data["PCT_WC"]}%`;
      document.querySelector("#mktshare-wc-tea").innerHTML = `${data["PCT_WC_TEA"]}%`;
      document.querySelector("#mktshare-twisted").innerHTML = `${data["PCT_TWISTED_TEA"]}%`;

    } else {
      document.querySelector("#mktshare-seltz").innerHTML = `N/A`;
      document.querySelector("#mktshare-wc").innerHTML = `N/A`;
    }

    getStoreInventory(db, storenum);
  });
}


function getStoreInventory(db, storenum) {
  const inventRef = ref(db, `Store_Inventory/${storenum}`);

  onValue(inventRef, (snapshot) => {

    const data = snapshot.val();

    if (data != null) {
        for (var key in data) {
          inventoryData.push([key, data[key]]);
        }
    } else {
      console.log("No inventory data");
    }

    fadeOutLoader();
  });
}


function getListStatus(db, storeID, sku, projected) {
  const listRef = ref(db, `Store_Data/${storeID}`);

  if (sku == "Cottages Springs Mixed 24 Pack") {
    sku = "Cottage Springs Mixed 24 Pack";
  } else if (sku == "Cottage Springs Mango Vodka Water -") {
    sku = "Cottage Springs Mango Vodka Water"
  }

  onValue(listRef, (snapshot) => {
    if (snapshot.child(sku).exists()) {
      if (snapshot.child(sku).val() != 'D') {
        listedData.push([sku.replace('-', '').replace('Cottages', 'Cottage'), '$' + roundToTwo(projected)]);
      } else {
        delistedData.push([sku.replace('-', '').replace('Cottages', 'Cottage'), '$' + roundToTwo(projected)]);
      }

    } else {
      delistedData.push([sku.replace('-', '').replace('Cottages', 'Cottage'), '$' + roundToTwo(projected)]);
    }
    checked_skus += 1;

    if (checked_skus == checked_skus_needed) {

      table_grid = new Grid({
        columns: [
          "SKU",
          {
            name: 'FY Forecast (FY23)',
            sort: {
              compare: (a, b) => {

                const floatA = parseFloat(a.replace('$', ''));
                const floatB = parseFloat(b.replace('$', ''));

                if (floatA > floatB) {
                  return 1;
                } else if (floatA < floatB) {
                  return -1;
                } else {
                  return 0;
                }
              }
            },
            formatter: (cell) => {
                return numberWithCommas(cell);
            }
          }
        ],
        search: true,
        pagination: {
          enabled: true,
          limit: 25
        },
        sort: true,
        data: delistedData,
      }).render(document.getElementById("table-wrap"));

      getStoreInfo(db, storeID);
    }
  });
}

function getStoreInfo(db, storeID) {
  console.log("GETTING STORE INFO");

  const storeRef = ref(db, `Store_List/${storeID}`);

  onValue(storeRef, (snapshot) => {
    const data = snapshot.val();
    document.querySelector("#store-name").innerHTML = `<b>Store Name</b><br>${data["Name"]}`;
    document.querySelector("#store-address").innerHTML = `<b>Store Address</b><br>${data["Address"]}<br>${data["City"]}, ${data["Province"]}<br>${data["Postal Code"]}`;
    document.querySelector("#store-class").innerHTML = `<b>Store Class</b><br>${data["Class"]}`;

    for (var key in data){
      console.log(`${key} ... ${data[key]}`);
    }

    getMetrics(db, storeID);
  });
}


var listedData = [];
var delistedData = [];
var inventoryData = [];

var checked_skus = 0;
var checked_skus_needed = 0;

var table_grid = new Grid();


function getStoreForecasts(db, storeID) {

  const date = new Date();
  const curPeriod = getPeriod(date.getMonth(), date.getDate(), date.getFullYear());
  const storeRef = ref(db, `Predicted_Data/FY${curPeriod[2]}P${curPeriod[0]}W${curPeriod[1]}/${storeID}`);

  //const storeRef_fy = ref(db, `Predicted_Data/FY${curPeriod[2]}/${storeID}`);
  const storeRef_fy = ref(db, `Predicted_Data_FY/FY23/${storeID}`);

  const forecastWait = onValue(storeRef_fy, (snapshot) => {
    const snapdata = snapshot.val();

    var tableData = [];
    for (var key in snapdata) {
      //tableData.push([key.replace('-', ''), roundToTwo(snapdata[key])]);
      checked_skus_needed += 1;
    }

    for (var key in snapdata) {
      getListStatus(db, storeID, key, roundToTwo(snapdata[key]));
    }
  });

  /*
  const forecastWait = onValue(storeRef, (snapshot) => {
    const snapdata = snapshot.val();

    var tableData = [];
    for (var key in snapdata) {
      tableData.push([key, roundToTwo(snapdata[key]["Revenue"]), roundToTwo(snapdata[key]["Sales"])]);
    }

    new Grid({
      columns: [
        "SKU",
        {
          name: 'Proj. Revenue ($)',
          sort: {
            compare: (a, b) => {

              const floatA = parseFloat(a);
              const floatB = parseFloat(b);

              if (floatA > floatB) {
                return 1;
              } else if (floatA < floatB) {
                return -1;
              } else {
                return 0;
              }
            }
          }
        },
        {
          name: 'Proj. Sales (Cases)',
          sort: {
            compare: (a, b) => {

              const floatA = parseFloat(a);
              const floatB = parseFloat(b);

              if (floatA > floatB) {
                return 1;
              } else if (floatA < floatB) {
                return -1;
              } else {
                return 0;
              }
            }
          }
        }
      ],
      //search: true,
      sort: true,
      data: tableData,
    }).render(document.getElementById("table-wrap"));

    getStoreInfo(db, storeID);
  });
  */
}

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle(`LCBO${this.params.id} Overview`);
    }

    async getHtml() {
      document.querySelector("body").style.backgroundImage = "url('../../static/img/white_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      const storeID = this.params.id;

      getStoreForecasts(this.db, `LCBO${storeID}`);


      setTimeout(function() {
        const downloadcsvbtn = document.getElementById('download-csv-button');

        downloadcsvbtn.addEventListener('click', () => {
          var tabledata = [];
          var filename = `LCBO${storeID}`;
          if (showing_option == 1) {
            tabledata = listedData;
            tabledata.unshift(['SKU', 'FY Forecast (FY23)']);
            filename += '_listed.csv';

          } else if (showing_option == 0) {
            tabledata = delistedData;
            tabledata.unshift(['SKU', 'FY Forecast (FY23)']);
            filename += '_delisted.csv';

          } else {
            tabledata = inventoryData;
            tabledata.unshift(['SKU', 'Inventory']);
            filename += '_inventory.csv';
          }

          let csvContent = "data:text/csv;charset=utf-8,"
              + tabledata.map(e => e.join(",")).join("\n");
              var encodedUri = encodeURI(csvContent);
          var link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", filename);
          document.body.appendChild(link); // Required for FF

          link.click(); // This will download the data file named "my_data.csv".
        });

        var showing_option = 0;
        const delistbtn = document.getElementById('delist-button');
        const listbtn = document.getElementById('list-button');
        const inventbtn = document.getElementById('inventory-button');

        delistbtn.addEventListener('click', () => {
          // Show delist button
          showing_option = 0;

          delistbtn.style.opacity = 1;
          listbtn.style.opacity = 0.5;
          inventbtn.style.opacity = 0.5;

          table_grid.updateConfig({columns: ['SKU', 'FY Forecast (FY23)'], data: delistedData}).forceRender();
        });

        listbtn.addEventListener('click', () => {
          // Show listing button
          showing_option = 1;

          listbtn.style.opacity = 1;
          delistbtn.style.opacity = 0.5;
          inventbtn.style.opacity = 0.5;

          table_grid.updateConfig({columns: ['SKU', 'FY Forecast (FY23)'], data: listedData}).forceRender();
        });

        inventbtn.addEventListener('click', () => {
          // Show other buttons
          showing_option = 2;

          inventbtn.style.opacity = 1;
          delistbtn.style.opacity = 0.5;
          listbtn.style.opacity = 0.5;

          table_grid.updateConfig({columns: ['SKU', 'Inventory'], data: inventoryData}).forceRender();
        });
      }, 1000);

      return `
        <div class = "store-top">
          LCBO #${storeID} <span class="dark-blue">&nbsp;Store Overview</span>
        </div>
        <div class="home-row">
          <div style="display: inline">
            <div class="details-widget" style="background: linear-gradient(180deg, #003b5c 75px, #E5F8FF 75px); width: 22vw;">
              <h1>Store Details</h1>
              <br>
              <h2 id="store-name"></h1>
              <h2 id="store-address"></h1>
              <h2 id="store-class"></h1>
            </div>
            <div class="details-widget" style="width: 22vw; margin-top: 20px;">
              <h1 style="margin-bottom: 40px; color: white;">Quick Look Metrics</h1>
              <h1 class="detail-head" style="padding-top: 10px;">Seltzer<span class="detail-right" id="mktshare-seltz"></span><br><span style="font-size: 15px;">Store Share</span></h1>
              <h1 class="detail-head">Tea<span class="detail-right" id="mktshare-tea"></span><br><span style="font-size: 15px;">Store Share</span></h1>
              <h1 class="detail-head">White Claw<span class="detail-right" id="mktshare-wc"></span><br><span style="font-size: 15px;">% of Sales</span></h1>
              <h1 class="detail-head">WC Tea<span class="detail-right" id="mktshare-wc-tea"></span><br><span style="font-size: 15px;">% of Sales</span></h1>
              <h1 class="detail-head" style="margin-bottom: 10px;">Twisted Tea<span class="detail-right" id="mktshare-twisted"></span><br><span style="font-size: 15px;">% of Sales</span></h1>
            </div>
          </div>
          <div class="table-widget">
            <div style="display: inline-block;">
              <h1 style="display: inline-block;">Store Opportunities</h1>
              <!--
              <button class="opportunity-button csv" id="download-csv-button">Export CSV</button>
              <button id="delist-button" class="opportunity-button delisted">DELISTED</button>
              <button id="list-button" class="opportunity-button listed">LISTED</button>
              <button id="inventory-button" class="opportunity-button inventory">Inventory</button>
              -->
              <button id="delist-button" class="opportunity-button delisted" style="margin-right: 405px;">DELISTED</button>
              <button id="list-button" class="opportunity-button listed" style="margin-right: 270px;">LISTED</button>
              <button class="opportunity-button csv" id="inventory-button" style="opacity: 0.5; margin-right: 135px; background-color:#f56909">INVENTORY</button>
              <button class="opportunity-button csv" id="download-csv-button" style="margin-right: 0px;">Export CSV</button>
            </div>
            <div id="table-wrap"></div>
          </div>
        </div>
      `;
    }
}
