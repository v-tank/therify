var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var db = require("./models");
var controllers = require("./controllers");

var PORT = process.env.PORT || 8080;

var app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({limit: '10mb'})); //for some reason, this is needed to see the body from fetch requests

var routes = require("./routes/routes");
app.use("/", routes);

mongoose.Promise = Promise; //Set Mongo to use promises for asynch queries

//connect to db
mongoose.connect("mongodb://localhost/therify", {
  //useMongoClient: true //got a warning saying to remove this
}).then(response => console.log("Connected to server."));

//start server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});