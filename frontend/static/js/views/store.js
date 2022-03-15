import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo } from "./periodFuncs.js";

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

  const forecastWait = onValue(storeRef, (snapshot) => {
    const snapdata = snapshot.val();
    var skuList = [];
    var salesList = [];
    var revList = [];

    const topHTML = `
      <div class = "store-top">
        ${storeID} <span class="dark-blue">&nbsp;Store Overview</span>
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
    `;

    const bottomHTML = `      </div>`;

    var predictionsHTML = ``;

    for (var key in snapdata) {
      skuList.push(key);
      salesList.push(roundToTwo(snapdata[key]["Sales"]));
      revList.push(roundToTwo(snapdata[key]["Revenue"]));
    }

    for (var i = 0; i < skuList.length; i++) {
      predictionsHTML += `<h2 style="margin-bottom: 0px;"><b>${skuList[i]}</b><br>REVENUE: $${revList[i]}&nbsp;&nbsp;&nbsp;SALES: ${salesList[i]}</h2>`

      if (i+1 == skuList.length) {
        predictionsHTML += "</div>";
      } else {
        predictionsHTML += "<br>";
      }
    }

    document.querySelector("#app").innerHTML = topHTML.concat(predictionsHTML, bottomHTML);

    getStoreInfo(db, storeID);
  });
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
            <h2 id="store-name"></h1>
            <h2 id="store-address"></h1>
            <h2 id="store-class"></h1>
          </div>
          <div class="table-widget">
            <h1>Store Opportunities</h1>
          </div>
        </div>
      `;
    }
}
