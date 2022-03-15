// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbH6XelEiQRcQJU3dWcA9-aqcz92YzZkI",
  authDomain: "aceapp-web.firebaseapp.com",
  databaseURL: "https://aceapp-web-default-rtdb.firebaseio.com",
  projectId: "aceapp-web",
  storageBucket: "aceapp-web.appspot.com",
  messagingSenderId: "776591242643",
  appId: "1:776591242643:web:55b3299d7c88982baf2466"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default class {
    constructor(params) {
        this.params = params;

        this.auth = getAuth();
        const db = getDatabase(app);
        this.db = db;
    }

    setTitle(title) {
      document.title = title + " | AceApp";
    }

    async getHtml() {
      return "";
    }
}
