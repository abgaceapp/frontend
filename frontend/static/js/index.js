import Landing from "./views/home.js";
import Territory from "./views/territory.js";
import AgencyTerritory from "./views/territory-agency.js";
import InventoryOverview from "./views/ist-opportunities.js";
import InventoryAvailable from "./views/ist-available.js";
import InventoryCheckoff from "./views/ist-override.js";
import InventoryIgnore from "./views/ist-ignore.js";
import Store from "./views/store.js";
import Agency from "./views/agency.js";
import Login from "./views/login.js";
import Account from "./views/account.js";
import StoreList from "./views/storeList.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Landing },
        //{ path: "/inventory/store/:id", view: Store },
        { path: "/inventory/:tm/checkoff/:store/:sku", view: InventoryCheckoff },
        { path: "/inventory/:tm/ignore/:store/:sku", view: InventoryIgnore },
        { path: "/inventory/:tm/ist/:store/:sku", view: InventoryAvailable },
        { path: "/inventory/:tm", view: InventoryOverview },
        { path: "/territory/lcbo/:tm", view: Territory },
        { path: "/territory/agency/:tm", view: AgencyTerritory },
        { path: "/store/lcbo/:id", view: Store },
        { path: "/store/agency/:id", view: Agency },
        { path: "/login", view: Login },
        { path: "/account", view: Account },
        { path: "/stores/:tm", view: StoreList }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));
    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});

import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

getAuth().onAuthStateChanged(function(user) {
  if (user) {
    var username = user.displayName;

    if (username == null) {
      username = "Admin";
    }

    console.log("USERNAME HERE");
    console.log(username);

    document.getElementById('main-rep-name').innerHTML = username;
    document.getElementById('menu-territory').href += username.toLowerCase();
    document.getElementById('menu-inventory').href += username.toLowerCase();
    document.getElementById('menu-territory-agency').href += username.toLowerCase();
    document.getElementById('menu-stores').href += username.toLowerCase();
    document.getElementById('main-rep').href = "/territory/" + username.toLowerCase();

  } else {
    console.log("NOT LOGGED IN!");
  }
});
