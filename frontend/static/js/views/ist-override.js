import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo, numberWithCommas } from "./periodFuncs.js"

import { Grid, html } from "https://unpkg.com/gridjs?module";


var checked_skus = 0;
var checked_skus_needed = 0;

var tableData = [];
var table_grid = new Grid();

var tm_name = "";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Confirm Receiving Inventory?');
    }

    async getHtml() {
      document.querySelector("body").style.backgroundImage = "url('../../../../static/img/dark_orange_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      fadeOutLoader();

      const store = `${this.params.store}`;
      const sku = `${this.params.sku.replaceAll('_', ' ')}`;
      const tm = `${this.params.tm}`;
      const db = this.db;


      setTimeout(function() {
        const cancelbtn = document.getElementById('checkoff-cancel');
        const confirmbtn = document.getElementById('checkoff-confirm');

        cancelbtn.addEventListener('click', () => {
          window.open(`/inventory/${tm}`, "_self");
        });

        confirmbtn.addEventListener('click', () => {
          const skuRef = ref(db, `Store_Inventory/${store}/${sku}`);

          console.log(skuRef);

          remove(skuRef)
          .then(function() {
            console.log("Checkoff succeeded.")
            window.open(`/inventory/${tm}`, "_self");
          })
          .catch(function(error) {
            console.log("Checkoff failed: " + error.message);
          });
        });

      }, 200);


      const baseString = `
        <div class="home-row">
          <div class="table-widget" style="background: linear-gradient(180deg, #780901 75px, white 75px); width: 100%">
            <div style="text-align: center;">
              <h1>Confirm Receiving Inventory?</h1>
              <h1 class="confirm-checkoff-warning">WARNING: THIS ACTION CANNOT BE UNDONE.</h1>
              <h1 class="confirm-checkoff-h1">Store</h1>
              <h1 class="confirm-checkoff-h2">${this.params.store}</h1>
              <h1 class="confirm-checkoff-h1">SKU</h1>
              <h1 class="confirm-checkoff-h2">${sku.replaceAll('-', '')}</h1>
              <button class="opportunity-button csv" id="checkoff-cancel" style="background-color: grey; position: static; margin: auto; margin-right: 20px; margin-top: 30px;">Cancel</button>
              <button class="opportunity-button csv" id="checkoff-confirm" style="background-color: #f5690a; position: static; margin: auto;">Confirm</button>
            </div>
            <div id="table-wrap"></div>
          </div>
        </div>
      `;

      return baseString;
    }
}
