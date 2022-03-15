import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo } from "./periodFuncs.js";

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle(`${this.params.tm.replace(/^\w/, (c) => c.toUpperCase())}'s Stores`);
    }

    async getHtml() {
      //getTMList(this.db);

      document.querySelector("body").style.backgroundImage = "url('../static/img/white_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      fadeOutLoader();

      const tm = `${this.params.tm.replace(/^\w/, (c) => c.toUpperCase())}`;

      return `
        <div class = "store-top">
          ${tm}'s<span class="dark-blue">&nbsp;Stores</span>
        </div>
        <div class="home-row">
          <div class="table-widget">
            <h1>Store Opportunities</h1>
          </div>
        </div>
      `;
    }
}
