import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getPeriod, roundToTwo } from "./periodFuncs.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";


function changePFP() {
  toastfs.success('Profile Update is Coming Soon!');
}

function signOutUser() {
  const auth = getAuth();
  signOut(auth).then(() => {
    document.location.href = "/login";

  }).catch((error) => {
    toastfs.error('There was an error signing you out!');
  });
}

function addListeners() {
  document.getElementById("save-btn").addEventListener("click", changePFP);
  document.getElementById("signout-btn").addEventListener("click", signOutUser);
}

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle(`My Account`);
    }

    async getHtml() {
      document.querySelector("body").style.backgroundImage = "url('../static/img/blue_bg.png')";
      document.getElementById("aceapp-header").style.visibility = "visible";

      var email = "Loading...";
      var username = "Loading...";
      var uid = "Loading...";

      getAuth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("LOGGED IN");
          email = user.email;
          username = user.displayName;
          uid = user.uid;

          document.getElementById('my-email').innerHTML = email;

          if (username == null) {
            document.getElementById('my-username').innerHTML = "No Username";
          } else {
            document.getElementById('my-username').innerHTML = username;
          }

          document.getElementById('my-id').innerHTML = '<span style="color: grey">UID: ' + uid + '</span>';

        } else {
          console.log("NOT LOGGED IN!");
        }

        addListeners();
        fadeOutLoader();
      });

      return `
        <div class="home-row" style="justify-content: center;">
          <div class="account-widget">
            <img src="static/img/default_pfp.png"></img>
            <h1><span style="font-family: 'Point Book'">My</span> Account</h1>
            <h2 id="my-username">
              Username
            </h2>
            <h2 id="my-email">
              Email
            </h2>
            <h2 id="my-id">
              UID
            </h2>
            <button id="save-btn">Change Profile Picture</button>
            <button id="signout-btn">Sign Out</button>
          </div>
        </div>
      `;
    }
}
