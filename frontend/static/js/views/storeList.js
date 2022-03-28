import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo } from "./periodFuncs.js";

import { Grid, html } from "https://unpkg.com/gridjs?module";

function getStoreList(db, tmName) {
  const date = new Date();
  const curPeriod = getPeriod(date.getMonth(), date.getDate(), date.getFullYear());
  const storeRef = ref(db, `TM_List/${tmName}`);

  const forecastWait = onValue(storeRef, (snapshot) => {
    const snapdata = snapshot.val();
    const lcboStores = [];

    const topHTML = `
      <div class="home-row">
        <div class="table-widget" style="width: 100%;">
          <h1>${tmName}'s<span class="light-blue">&nbsp;Stores</span></h1>
    `;

    const bottomHTML = `</div>`;

    var predictionsHTML = ``;


    var storeData = [];

    var i = 0;
    for (var key in snapdata) {
      if (key.startsWith("LCBO")) {
        const storeCode = key.replace('LCBO', '');
        predictionsHTML += `<a style="margin-bottom: 0px;" href="/store/${storeCode}">LCBO #${storeCode}</a>`

        storeData.push([`LCBO #${storeCode}`]);

        if (i+1 == snapdata.length) {
          predictionsHTML += "</div>";
        } else {
          predictionsHTML += "<br>";
        }
      }

      i += 1;
    }

    console.log(storeData);

    new Grid({
      columns: [
        {
          name: "LCBO Store ID",
          formatter: (cell) => {
              return html(`<a href="/store/${cell.slice(5).replace('#', '')}" target="_blank">${cell}</a>`);
          },
          sort: {
            compare: (a, b) => {

              const intA = parseInt(a.replace('LCBO #', ''));
              const intB = parseInt(b.replace('LCBO #', ''));

              if (intA > intB) {
                return 1;
              } else if (intA < intB) {
                return -1;
              } else {
                return 0;
              }
            }
          }
        }
      ],
      search: true,
      sort: true,
      pagination: true,
      data: storeData,
    }).render(document.getElementById("table-wrapper"));

    //document.querySelector("#app").innerHTML = topHTML.concat(predictionsHTML, bottomHTML);
    fadeOutLoader();
  });
}


export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle(`${this.params.tm.replace(/^\w/, (c) => c.toUpperCase())}'s Stores`);
    }

    async getHtml() {
      //getTMList(this.db);

      document.querySelector("body").style.backgroundImage = "url('../static/img/white_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      const tmName = `${this.params.tm.replace(/^\w/, (c) => c.toUpperCase())}`;

      getStoreList(this.db, tmName);

      return `
        <div class="home-row">
          <div class="table-widget" style="width: 100%;">
            <h1>${tmName}'s<span class="light-blue">&nbsp;Stores</span></h1>
            <div id="table-wrapper"></div>
          </div>
        </div>
      `;
    }
}
