import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo } from "./periodFuncs.js"

import { Grid, html } from "https://unpkg.com/gridjs?module";


function getMetrics(db, name) {
  console.log(`TM_List/${name}`);
  const metricRef = ref(db, `TM_List/${name}`);

  console.log("GETTING METRICS FOR")
  console.log(name);

  onValue(metricRef, (snapshot) => {
    const data = snapshot.val();
    document.querySelector("#mktshare-rtd").innerHTML = `${data["MktShare_RTD"]}%`;
    document.querySelector("#mktshare-seltz").innerHTML = `${data["MktShare_Seltz"]}%`;
    document.querySelector("#mktshare-tea").innerHTML = `${data["MktShare_Tea"]}%`;
    document.querySelector("#mktshare-wc").innerHTML = `${data["MktShare_WC"]}%`;

    fadeOutLoader();
  });
}


var storeCount = 0;
var storesAddedCount = 0;

var checked_skus = 0;
var checked_skus_needed = 0;

var listedData = [];
var delistedData = [];

var table_grid = new Grid();
var tm_name = "";


function getListStatus(db, storeID, sku, projected) {
  const listRef = ref(db, `Store_Data/${storeID}`);

  onValue(listRef, (snapshot) => {
    if (snapshot.child(sku).exists()) {
      console.log("CHILD VAL");
      console.log(sku)
      console.log(snapshot.child(sku).val());
      if (snapshot.child(sku).val() != 'D') {
        listedData.push([sku.replace('-', '').replace('Cottages', 'Cottage'), roundToTwo(projected), storeID]);
      } else {
        delistedData.push([sku.replace('-', '').replace('Cottages', 'Cottage'), roundToTwo(projected), storeID]);
      }

    } else {
      console.log("DELISTED");
      delistedData.push([sku.replace('-', '').replace('Cottages', 'Cottage'), roundToTwo(projected), storeID]);
    }
    checked_skus += 1;

    if (checked_skus == checked_skus_needed) {

      table_grid = new Grid({
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
            name: "Store",
            formatter: (cell) => {
                return html(`<a href="/store/${cell.slice(4)}" target="_blank">${cell}</a>`);
            }
          }
        ],
        //search: true,
        pagination: true,
        sort: true,
        data: delistedData,
      }).render(document.getElementById("table-wrap"));

      getMetrics(db, tm_name);
    }
  });
}

/*
async function getStorePredictions(db, predictionRef, storeKey, tmName) {
  const test = onValue(predictionRef, (predSnap) => {
    const predictionKeySnap = predSnap.val();

    for (var predictionKey in predictionKeySnap) {
      //console.log("PREDICTION KEY" + predictionKey + storeKey);
      tableData.push([predictionKey.replace('-',''), roundToTwo(predictionKeySnap[predictionKey]), storeKey]);
    }

    storesAddedCount += 1;

    if (storesAddedCount == storeCount) {

    }
  });
}
*/

function getStoreForecasts(db, storeID, tmName) {
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
      tm_name = tmName;
      getListStatus(db, storeID, key, roundToTwo(snapdata[key]));
    }
  });
}


function getTerritoryForecasts(db, tmName) {
  storeCount = 0;
  storesAddedCount = 0;
  //tableData = [];

  listedData = [];
  delistedData = [];

  const date = new Date();
  const curPeriod = getPeriod(date.getMonth(), date.getDate(), date.getFullYear());
  const storeRef = ref(db, `Predicted_Data/FY${curPeriod[2]}P${curPeriod[0]}W${curPeriod[1]}/${tmName}`);

  const storelistRef = ref(db, `TM_List/${tmName}`);

  onValue(storelistRef, async (snapshot) => {
    const storelistSnap = snapshot.val();

    for (var storeKey in storelistSnap) {
      if (storeKey.substring(0,4) == "LCBO") {
        storeCount += 1;

        console.log(storeKey);

        var tableData = [];
        const predictionRef = ref(db, `Predicted_Data_FY/FY23/${storeKey}`);

        //getStorePredictions(db, predictionRef, storeKey, tmName);
        getStoreForecasts(db, storeKey, tmName);
      }
    }
  })

  /*
  const predictionRef = ref(db, `Predicted_Data_FY/FY${curPeriod[2]}/`)

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
        "Store"
      ],
      //search: true,
      sort: true,
      data: tableData,
    }).render(document.getElementById("table-wrap"));

    getMetrics(db, tmName);
  });
  */
}


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(`${this.params.tm.replace(/^\w/, (c) => c.toUpperCase())}'s Territory`);
    }

    async getHtml() {

      document.querySelector("body").style.backgroundImage = "url('../static/img/liteblue_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      const date = new Date();
      const curPeriod = getPeriod(date.getMonth(), date.getDate(), date.getFullYear());
      const periodCode = `FY${curPeriod[2]}P${curPeriod[0]}W${curPeriod[1]}`;

      var tmName = `${this.params.tm}`;
      tmName = tmName.replace(/^\w/, (c) => c.toUpperCase());

      getTerritoryForecasts(this.db, tmName);


      var showing_listed = false;

      setTimeout(function() {
        const delistbtn = document.getElementById('delist-button');
        const listbtn = document.getElementById('list-button');

        delistbtn.addEventListener('click', () => {
          if (showing_listed) {
            // Show delist button
            delistbtn.style.opacity = 1;
            listbtn.style.opacity = 0.5;
            showing_listed = false;

            table_grid.updateConfig({data: delistedData}).forceRender();
          }
        });

        listbtn.addEventListener('click', () => {
          if (!showing_listed) {
            // Show listing button
            listbtn.style.opacity = 1;
            delistbtn.style.opacity = 0.5;
            showing_listed = true;

            table_grid.updateConfig({data: listedData}).forceRender();
          }
        });
      }, 1000);

      const baseString = `
        <div class = "territory-top">
          ${tmName}'s <span class="light-blue">Territory Overview</span>
        </div>
        <div class="home-row">
          <div class="details-widget">
            <h1 style="margin-bottom: 40px; color: white;">Quick Look Metrics</h1>
            <h1 class="detail-head" style="padding-top: 10px;">RTD<span class="detail-right" id="mktshare-rtd"></span><br><span style="font-size: 15px;">Market Share</span></h1>
            <h1 class="detail-head">Seltzer<span class="detail-right" id="mktshare-seltz"></span><br><span style="font-size: 15px;">Market Share</span></h1>
            <h1 class="detail-head">White Claw<span class="detail-right" id="mktshare-wc"></span><br><span style="font-size: 15px;">Market Share</span></h1>
            <h1 class="detail-head" style="margin-bottom: 10px;">Tea<span class="detail-right" id="mktshare-tea"></span><br><span style="font-size: 15px;">Market Share</span></h1>
          </div>
          <div class="table-widget">
            <div style="display: inline-block;">
              <h1 style="display: inline-block;">Territory Opportunities</h1>
              <button id="delist-button" class="opportunity-button delisted">DELISTED</button>
              <button id="list-button" class="opportunity-button listed">LISTED</button>
            </div>
            <div id="table-wrap"></div>
          </div>
        </div>
      `;

      return baseString;
    }
}
