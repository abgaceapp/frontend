import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async getHtml() {
      return `
        <div class = "territory-top">
          Andrew's <span class="light-blue">Territory Overview</span>
        </div>
        <div class="home-row">
          <div class="leader-widget">
            <h1>Live Leaderboard ($ Closed)</h1>
            <h2>May 20 - May 27</h2>
          </div>
          <div class="wc-widget">
            <h1>% of White Claw</h1>
            <h2>May 20 - May 27</h2>
          </div>
          <div class="seltzer-widget">
            <h1>Seltzer Mkt Share</h1>
            <h2>May 20 - May 27</h2>
          </div>
        </div>
      `;
    }
}
