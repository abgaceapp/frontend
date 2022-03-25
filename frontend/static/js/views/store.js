import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo } from "./periodFuncs.js";

// Table functions
import { Grid, html } from "https://unpkg.com/gridjs?module";
//import "https://unpkg.com/gridjs/dist/theme/mermaid.css";


function getTMList(db) {
  const tmRef = ref(db, 'TM_List/');

  onValue(tmRef, (snapshot) => {
    const data = snapshot.val();
    for (var key in data){
      console.log("TERRITORY MANAGER");
      console.log( key, data[key] );
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

    fadeOutLoader();
  });
}

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
      tableData.push([key.replace('-', ''), roundToTwo(snapdata[key])]);
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
        }
      ],
      //search: true,
      pagination: true,
      sort: true,
      data: tableData,
    }).render(document.getElementById("table-wrap"));

    getStoreInfo(db, storeID);
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
      //getTMList(this.db);

      document.querySelector("body").style.backgroundImage = "url('../static/img/white_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      const storeID = this.params.id;

      getStoreForecasts(this.db, `LCBO${storeID}`);

      return `
        <div class = "store-top">
          LCBO #${storeID} <span class="dark-blue">&nbsp;Store Overview</span>
        </div>
        <div class="home-row">
          <div class="details-widget" style="background-color: #E5F8FF">
            <h1>Store Details</h1>
            <br>
            <h2 id="store-name"></h1>
            <h2 id="store-address"></h1>
            <h2 id="store-class"></h1>
          </div>
          <div class="table-widget">
            <h1>Store Opportunities</h1>
            <div id="table-wrap"></div>
          </div>
        </div>
      `;
    }
}
