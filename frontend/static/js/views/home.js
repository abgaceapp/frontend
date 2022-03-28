import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod } from "./periodFuncs.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async getHtml() {
      getAuth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("LOGGED IN");
          console.log(user.email);
          console.log("HERE");

        } else {
          console.log("NOT LOGGED IN!");
          document.location.href = "/login";
        }
      });

      document.querySelector("body").style.backgroundImage = "url('../static/img/blue_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      const date = new Date();
      const curPeriod = getPeriod(date.getMonth(), date.getDate(), date.getFullYear());

      const dollarRef = ref(this.db, 'Live_Leaderboard/Dollars_Closed/');
      const leaderRef = ref(this.db, 'Live_Leaderboard/');

      const leaderWait = await onValue(leaderRef, (snapshot) => {
        var dollar_List = [];
        var dollar_NumList = [];

        var wcpct_List = [];
        var wcpct_NumList = [];

        var seltzmkt_List = [];
        var seltzmkt_NumList = [];

        const snapdata = snapshot.val();
        for (var key in snapdata) {
          console.log(key);

          if (key == "Dollars_Closed") {
            for (var subkey in snapdata[key]) {
              for (var subsubkey in snapdata[key][subkey]) {
                dollar_List.push(subsubkey);
                dollar_NumList.push(snapdata[key][subkey][subsubkey]);
              }
            }
          } else if (key == "Seltzer_Mkt") {
            for (var subkey in snapdata[key]) {
              for (var subsubkey in snapdata[key][subkey]) {
                seltzmkt_List.push(subsubkey);
                seltzmkt_NumList.push(snapdata[key][subkey][subsubkey]);
              }
            }
          } else if (key == "PCT_WC") {
            for (var subkey in snapdata[key]) {
              for (var subsubkey in snapdata[key][subkey]) {
                wcpct_List.push(subsubkey);
                wcpct_NumList.push(snapdata[key][subkey][subsubkey]);
              }
            }
          } else {
            console.log("UNKNOWN KEY!");
          }
        }

        const baseString = `
          <div class="home-row">
            <div class="leader-widget">
              <h1>Live Leaderboard ($ Closed)</h1>
              <h2 style="margin-bottom: 30px;">${curPeriod[3]}</h2>\n`;

        var loadedString = ``;

        for (var i = 0; i < dollar_List.length; i++) {
          if (dollar_NumList[i] < 0) {
            loadedString += `<p class="leaderboard-row">${dollar_List[i]} <span class="leaderboard-row-right" style="color:#FE685E;">${Math.abs(dollar_NumList[i])}</span></p>`;
          } else {
            loadedString += `<p class="leaderboard-row">${dollar_List[i]} <span class="leaderboard-row-right">${dollar_NumList[i]}</span></p>`;
          }
          if (i + 1 == dollar_List.length) {
            loadedString += `<p class="leaderboard-row"></p></div>`
          }
        }

        loadedString += `<div class="wc-widget">
          <h1>% of White Claw</h1>
          <h2 style="margin-bottom: 30px;">${curPeriod[3]}</h2>`;

        for (var i = 0; i < wcpct_List.length; i++) {
          if (wcpct_NumList[i] < 0) {
            loadedString += `<p class="leaderboard-row">${wcpct_List[i]} <span class="leaderboard-row-right" style="color:#FE685E;">${Math.abs(wcpct_NumList[i])}%</span></p>`;
          } else {
            loadedString += `<p class="leaderboard-row">${wcpct_List[i]} <span class="leaderboard-row-right">${wcpct_NumList[i]}%</span></p>`;
          }
          if (i + 1 == wcpct_List.length) {
            loadedString += `<p class="leaderboard-row"></p></div>`
          }
        }

        loadedString += `<div class="seltzer-widget">
                      <h1>Seltzer Mkt Share</h1>
                      <h2 style="margin-bottom: 30px;">${curPeriod[3]}</h2>`;

        for (var i = 0; i < seltzmkt_List.length; i++) {
          if (seltzmkt_NumList[i] < 0) {
            loadedString += `<p class="leaderboard-row">${seltzmkt_List[i]} <span class="leaderboard-row-right" style="color:#FE685E;">${Math.abs(seltzmkt_NumList[i])}%</span></p>`;
          } else {
            loadedString += `<p class="leaderboard-row">${seltzmkt_List[i]} <span class="leaderboard-row-right">${seltzmkt_NumList[i]}%</span></p>`;
          }
          if (i + 1 == seltzmkt_List.length) {
            loadedString += `<p class="leaderboard-row"></p></div>`
          }
        }

        loadedString += `</div>`;

        document.querySelector("#app").innerHTML = baseString.concat(loadedString);

        fadeOutLoader();
      });

      return `
        <div class="home-row">
          <div class="leader-widget">
            <h1>Live Leaderboard ($ Closed)</h1>
            <h2 id="date-range-a">${curPeriod[3]}</h2>
          </div>
          <div class="wc-widget">
            <h1>% of White Claw</h1>
            <h2 id="date-range-b">${curPeriod[3]}</h2>
          </div>
          <div class="seltzer-widget">
            <h1>Seltzer Mkt Share</h1>
            <h2 id="date-range-c">${curPeriod[3]}</h2>
          </div>
        </div>
      `;
    }
}
