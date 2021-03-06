import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo, numberWithCommas } from "./periodFuncs.js"

import { Grid, html } from "https://unpkg.com/gridjs?module";


var checked_skus = 0;
var checked_skus_needed = 0;

var tableData = [];
var table_grid = new Grid();


function getStockoutPredict(db, ref_str, sku, storeID, week, tmName) {
  const storeRef = ref(db, ref_str);

  const stockedoutForecast = onValue(storeRef, (snapshot) => {
    const snapdata = snapshot.val();

    if (snapdata != null) {
      checked_skus += 1;

      tableData.push([sku, "$"+roundToTwo(snapdata["Revenue"]), storeID, "Check Off"]);

    } else {
      checked_skus_needed -= 1;

      if (sku == "Cottages Springs Mixed 24 Pack") {
        console.log("TWO FOUR EMPTY");
        console.log(ref_str);
      }
    }

    if (checked_skus == checked_skus_needed) {
      table_grid = new Grid({
        columns: [
          {
            name: "SKU",
            formatter: (cell) => {
                return `${cell.replace('-', '').replace('Cottages', 'Cottage')}`;
            }
          },
          {
            name: `Weekly Forecast (${week})`,
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
          },
          {
            name: "Store",
            formatter: (cell) => {
                return html(`<a href="/store/lcbo/${cell.slice(4)}" target="_blank">${cell}</a>`);
            }
          },
          {
            name: "Actions",
            formatter: (_, row) => html(
              `<a
              style="text-decoration: underline; color: #780901; font-weight: bold; cursor: pointer;"
              href='/inventory/${tmName.replace(/^\w/, (c) => c.toLowerCase()).replaceAll('/', '')}/ist/${row.cells[2].data}/${row.cells[0].data.replaceAll(' ', '_')}'>IST</a>
              <a
              style="text-decoration: underline; color: gray; font-weight: bold; cursor: pointer; float: right;"
              href='/inventory/${tmName.replace(/^\w/, (c) => c.toLowerCase()).replaceAll('/', '')}/ignore/${row.cells[2].data}/${row.cells[0].data.replaceAll(' ', '_')}'>Ignore</a>`
            )
          }
        ],
        search: {
          selector: (cell, rowIndex, cellIndex) => (cellIndex == 2 || cellIndex == 0) ? cell : 0
        },
        pagination: {
          enabled: true,
          limit: 25
        },
        sort: true,
        data: tableData,
      }).render(document.getElementById("table-wrap"));

      const searchbar = document.getElementsByClassName('gridjs-search-input')[0];
      searchbar.placeholder = 'Search by LCBO # or SKU (i.e. Product Name)...';
      searchbar.style.width = '375px';

      // Sort highest -> lowest
      document.getElementsByClassName('gridjs-th-sort')[1].click();
      document.getElementsByClassName('gridjs-th-sort')[1].click();

      fadeOutLoader();
    }
  });
}



function getStockedout(db, storeID, tmName) {
  const date = new Date();
  const curPeriod = getPeriod(date.getMonth(), date.getDate(), date.getFullYear());
  const stockoutRef = ref(db, `Store_Inventory/${storeID}`);

  //const storeRef_fy = ref(db, `Predicted_Data/FY${curPeriod[2]}/${storeID}`);
  //const storeRef_fy = ref(db, `Predicted_Data_FY/FY23/${storeID}`);

  const stockedoutItems = onValue(stockoutRef, (snapshot) => {
    const snapdata = snapshot.val();

    for (var key in snapdata) {
      //console.log("HERE KEY " + key + " -> " + storeID);

      if (snapdata[key] == 0) {
        // Skip non-stocked out skus

        if (key == "Cottage Springs Mixed 24 Pack") {
          getStockoutPredict(db, `Predicted_Data/FY${curPeriod[2]}P${curPeriod[0]}W${curPeriod[1]}/${storeID}/${key.replace('Cottage', 'Cottages')}`, key, storeID, `P${curPeriod[0]}W${curPeriod[1]}`, tmName);

        } else {
          getStockoutPredict(db, `Predicted_Data/FY${curPeriod[2]}P${curPeriod[0]}W${curPeriod[1]}/${storeID}/${key.replace('Cottages', 'Cottage')}`, key, storeID, `P${curPeriod[0]}W${curPeriod[1]}`, tmName);
          checked_skus_needed += 1;
        }
      }
    }
  });
}


function getStockedoutForecasts(db, tmName) {
  tableData = [];

  const storelistRef = ref(db, `TM_List/${tmName}`);

  onValue(storelistRef, async (snapshot) => {
    const storelistSnap = snapshot.val();

    for (var storeKey in storelistSnap) {
      if (storeKey.substring(0,4) == "LCBO") {
        var tableData = [];

        getStockedout(db, storeKey, tmName);
      }
    }
  })
}


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(`${this.params.tm.replace(/^\w/, (c) => c.toUpperCase())}'s Inventory`);
    }

    async getHtml() {

      document.querySelector("body").style.backgroundImage = "url('../../static/img/dark_orange_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      const date = new Date();
      const curPeriod = getPeriod(date.getMonth(), date.getDate(), date.getFullYear());
      const periodCode = `FY${curPeriod[2]}P${curPeriod[0]}W${curPeriod[1]}`;

      var tmName = `${this.params.tm}`;
      tmName = tmName.replace(/^\w/, (c) => c.toUpperCase());

      getStockedoutForecasts(this.db, tmName);

      setTimeout(function() {
        const downloadcsvbtn = document.getElementById('download-csv-button');

        downloadcsvbtn.addEventListener('click', () => {
          var tabledata = [];
          var filename = `${tmName}_Stockout`;

          var tabledata = tableData.map(function(val) {
            return val.slice(0, -1);
          });

          tabledata.unshift(['SKU', 'Weekly Forecast', 'Store'])

          let csvContent = "data:text/csv;charset=utf-8,"
              + tabledata.map(e => e.join(",")).join("\n");
              var encodedUri = encodeURI(csvContent);
          var link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", filename);
          document.body.appendChild(link); // Required for FF

          link.click(); // This will download the data file
        });
      }, 1000);

      const baseString = `
        <div class = "territory-top" style="background-color: #780901">
          ${tmName}'s <span class="light-blue" style="color: #f5690a">IST Opportunities</span>
        </div>
        <div class="home-row">
          <div style="display: inline;">
            <div class="details-widget" style="width: 15vw; background: linear-gradient(180deg, #780901 75px, white 75px);">
              <h1 style="margin-bottom: 30px; color: white;">Quick Links</h1>
              <button class="links-button" onclick="window.open('/territory/lcbo/${this.params.tm}', '_self');">LCBO</button>
              <br>
              <button class="links-button agency" onclick="window.open('/territory/agency/${this.params.tm}', '_self');">AGENCY</button>
              <br>
              <button class="links-button stores" onclick="window.open('/stores/${this.params.tm}', '_self');">ALL STORES</button>
            </div>
          </div>
          <div class="table-widget" style="background: linear-gradient(180deg, #780901 75px, white 75px); width: 100%">
            <div style="display: inline-block;">
              <h1 style="display: inline-block;">Stockouts</h1>
              <!-- <button class="opportunity-button csv" id="lcbo-button" style="margin-right: 135px; background-color: #54c8f5" onclick="location.href='/territory/lcbo/${this.params.tm}'">LCBO</button> -->
              <button class="opportunity-button csv" id="download-csv-button" style="margin-right: 0px; background-color: #f5690a">Export CSV</button>
              <!-- <button id="delist-button" class="opportunity-button delisted">DELISTED</button>
              <button id="list-button" class="opportunity-button listed">LISTED</button> -->
            </div>
            <div id="table-wrap"></div>
          </div>
        </div>
      `;

      return baseString;
    }
}
