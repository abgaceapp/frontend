import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo, numberWithCommas } from "./periodFuncs.js"

import { Grid, html } from "https://unpkg.com/gridjs?module";


var tableData = [];
var table_grid = new Grid();


var invent_checked = 0;
var invent_checked_needed = 0;

function getInStock(db, store, sku, tm) {
  const inventory_ref = ref(db, `Store_Inventory/${store}/${sku}`);

  onValue(inventory_ref, (snapshot) => {
    const stock = snapshot.val();

    if (stock != null && stock != 0) {
      tableData.push([store, stock, 'x'])
      invent_checked += 1;

    } else {
      invent_checked_needed -= 1;
    }

    if (invent_checked == invent_checked_needed) {
      table_grid = new Grid({
        columns: [
          {
            name: "Store",
            formatter: (cell) => {
                return html(`<a href="/store/lcbo/${cell.slice(4)}" target="_blank">${cell}</a>`);
            }
          },
          'Stock',
          {
            name: "Action",
            formatter: (_, row) => html(
              `<a
              style="text-decoration: underline; color: #780901; font-weight: bold; cursor: pointer;"
              href='/inventory/${tm.replace(/^\w/, (c) => c.toLowerCase()).replaceAll('/', '')}/checkoff/${row.cells[2].data}/${row.cells[0].data.replaceAll(' ', '_')}'>Confirm IST</a>`
            )
          }
        ],
        search: {
          selector: (cell, rowIndex, cellIndex) => (cellIndex == 0) ? cell : 0
        },
        pagination: {
          enabled: true,
          limit: 25
        },
        sort: true,
        data: tableData,
      }).render(document.getElementById("table-wrap"));

      const searchbar = document.getElementsByClassName('gridjs-search-input')[0];
      searchbar.placeholder = 'Search by LCBO #...';

      document.getElementsByClassName('gridjs-th-sort')[1].click();
      document.getElementsByClassName('gridjs-th-sort')[1].click();

      fadeOutLoader();
    }
  });
}


function getISTOptions(db, tm, sku, store) {
  const tm_storelist_ref = ref(db, `TM_List/${tm}`);

  onValue(tm_storelist_ref, (snapshot) => {
    const storelistSnap = snapshot.val();

    for (var storeKey in storelistSnap) {
      if (storeKey.substring(0, 4) == "LCBO") {
        getInStock(db, storeKey, sku, tm);

        invent_checked_needed += 1;
      }
    }
  });
}


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(`IST to ${this.params.store}`);
    }

    async getHtml() {

      document.querySelector("body").style.backgroundImage = "url('../../../../static/img/light_orange_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      const date = new Date();
      const curPeriod = getPeriod(date.getMonth(), date.getDate(), date.getFullYear());
      const periodCode = `FY${curPeriod[2]}P${curPeriod[0]}W${curPeriod[1]}`;

      var tmName = `${this.params.tm}`;
      tmName = tmName.replace(/^\w/, (c) => c.toUpperCase());

      var skuName = `${this.params.sku}`;
      skuName = skuName.replaceAll('_', ' ');

      const store = `${this.params.store}`;


      getISTOptions(this.db, tmName, skuName, store);

      //getStockedoutForecasts(this.db, tmName);

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
          ${skuName.replaceAll('-', '')}&nbsp;&nbsp;&nbsp;<span class="light-blue" style="color: #f5690a">IST Options</span>
        </div>
        <div class="home-row">
          <div style="display: inline;">
            <div class="details-widget" style="width: 15vw; background: linear-gradient(180deg, #780901 75px, white 75px);">
              <h1 style="margin-bottom: 30px; color: white;">Quick Links</h1>
              <button class="links-button inventory" onclick="window.open('/inventory/${this.params.tm}', '_self');">BACK TO IST OPPORTUNITIES</button>
              <br>
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
