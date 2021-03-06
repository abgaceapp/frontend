import AbstractView from "./AbstractView.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";


const displaynames = {
  "gwilliams@acebeveragegroup.com": "Garrett",
  "ajabar@acebeveragegroup.com": "Andrew",
  "avergeer@acebeveragegroup.com": "Angie",
  "cfranke@acebeveragegroup.com": "Connor",
  "cgemmell@acebeveragegroup.com": "Courtney",
  "ihetherington@acebeveragegroup.com": "Isaac",
  "jhetherington@acebeveragegroup.com": "Jacob",
  "jsavard@acebeveragegroup.com": "Josee",
  "jjennings@acebeveragegroup.com": "Justine",
  "lroy@acebeveragegroup.com": "Leigh",
  "mkerr@acebeveragegroup.com": "Mark",
  "nbruni@acebeveragegroup.com": "Nick",
  "tokeefe@acebeveragegroup.com": "Taylor"
};


function logSubmit() {
  console.log("CLICKED");

  const email = document.getElementById('email-form').value;
  const pw = document.getElementById('pass-form').value;

  signInWithEmailAndPassword(getAuth(), email, pw).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
      toastfs.error('Incorrect password!');

    } else if (errorCode === 'auth/user-not-found') {
      toastfs.error('This account does not exist!');

    } else if (errorCode === "auth/invalid-email") {
      toastfs.error('Please enter a valid email address!');
    }

    console.log(error);
  });
}

function addListen() {
  document.getElementById("login-btn").addEventListener("click", logSubmit);
  document.getElementById("forgot-pass-btn").addEventListener("click", forgotPass);
}

function forgotPass() {
  const email = document.getElementById('email-form').value;

  sendPasswordResetEmail(getAuth(), email).then(() => {
    toastfs.success('Reset link sent to your email!');

  }).catch(function(error) {
    toastfs.error("Oops! Please try again!");
  });
}


export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle(`Login`);
    }

    async getHtml() {
      document.getElementById("aceapp-header").style.visibility = "hidden";
      document.querySelector("body").style.backgroundImage = "url('../static/img/blue_bg.png')";

      setTimeout(addListen, 1000);

      getAuth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("LOGGED IN");
          console.log(user.email);

          document.location.href = "/";

        } else {
          console.log("NOT LOGGED IN!");
        }

        fadeOutLoader();
      });

      return `
      <div class="loginWrapper">
        <div class="loginDiv">
          <form class="loginForm">
            <h1>Welcome!</h1>
            <h2>Enter your <b>Ace <span style="color:#5CC9F3;">App</span></b> credentials to get started.</h2>
            <p>Email</p>
            <input type="email" id="email-form" required>
            <p>Password</p>
            <input type="password" id="pass-form" required>
            <button type='button' id="login-btn">Log In</button>
            <button type='button' id="forgot-pass-btn">Forgot Password?</button>
        	</form>
        </div>
      </div>
      `;
    }
}
