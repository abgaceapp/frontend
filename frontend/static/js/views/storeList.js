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

    var storeData = [];
    for (var key in snapdata) {
      var storeCode = key;

      if (storeCode.startsWith("L")) {
        storeCode = storeCode.replace('LCBO', '');
        storeData.push([`LCBO #${storeCode}`, 'LCBO']);

      } else if (storeCode.startsWith("A")) {
        storeCode = storeCode.replace('Agency', '');
        storeData.push([`Agency #${storeCode}`, 'Agency']);
      }
    }


    new Grid({
      columns: [
          {
            name: "Store ID",
            formatter: (cell) => {
                if (cell.startsWith("L")) {
                  return html(`<a href="/store/lcbo/${cell.slice(5).replace('#', '')}" target="_blank">${cell}</a>`);
                } else {
                  return html(`<a href="/store/agency/${cell.slice(7).replace('#', '')}" target="_blank">${cell}</a>`);
                }
          },
          sort: {
            compare: (a, b) => {

              if (a.startsWith("L")) {
                a = a.replace('LCBO #', '');
              } else if (a.startsWith("A")) {
                a = a.replace('Agency #', '');
              }

              if (b.startsWith("L")) {
                b = b.replace('LCBO #', '');
              } else if (b.startsWith("A")) {
                b = b.replace('Agency #', '');
              }

              const intA = parseInt(a);
              const intB = parseInt(b);

              if (intA > intB) {
                return 1;
              } else if (intA < intB) {
                return -1;
              } else {
                return 0;
              }
            }
          }
        },
        "Store Type"
      ],
      search: true,
      sort: true,
      pagination: {
        enabled: true,
        limit: 25
      },
      data: storeData,
    }).render(document.getElementById("table-wrapper"));

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
        <div style="display: inline;">
            <div class="details-widget" style="width: 15vw;">
              <h1 style="margin-bottom: 30px; color: white;">Quick Links</h1>
              <button class="links-button" onclick="window.open('/territory/lcbo/${this.params.tm}', '_self');">LCBO</button>
              <br>
              <button class="links-button agency" onclick="window.open('/territory/agency/${this.params.tm}', '_self');">AGENCY</button>
              <br>
              <button class="links-button inventory" onclick="window.open('/inventory/${this.params.tm}', '_self');">IST OPPORTUNITIES</button>
            </div>
          </div>
          <div class="table-widget" style="width: 100%;">
            <h1>${tmName}'s<span class="light-blue">&nbsp;Stores</span></h1>
            <div id="table-wrapper"></div>
          </div>
        </div>
      `;
    }
}
