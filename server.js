const functions = require('firebase-functions');
const express = require("express");
const path = require("path");
var favicon = require('serve-favicon');

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.use(favicon(__dirname + '/public/images/favicon.ico'));

/*
app.get("/territory/:tm", function(req, res) {
  //res.send('Territory Manager is ' + req.params.tm);
  res.sendFile(path.resolve(__dirname, "frontend", "territory.html"))
})

app.get("/store/:id", function(req, res) {
  //res.send('Store ID is ' + req.params.id);
  res.sendFile(path.resolve(__dirname, "frontend", "store.html"))
})
*/

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
