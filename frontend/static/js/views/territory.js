import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod } from "./periodFuncs.js"


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

      getMetrics(this.db, tmName)

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
            <h1 style="margin-bottom: 40px; color: white;">Territory Opportunities</h1>
          </div>
        </div>
      `;

      const dynamString = ``;

      return dynamString + baseString;
    }
}
