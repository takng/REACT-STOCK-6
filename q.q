"use strict"

require("dotenv").config()

const PORT        = 3002
const ENV         = process.env.ENV || "development"
const express     = require("express")
const bodyParser  = require("body-parser")
const sass        = require("node-sass-middleware")
const app         = express()
const knexConfig  = require("./knexfile")
const knex        = require("knex")(knexConfig[ENV])
const morgan      = require("morgan")
const knexLogger  = require("knex-logger")

const Mailgun = require("mailgun-js");
const api_key = "key-c2976c8955c990f0429de584a51e234f";
const domain = "sandbox0a90c21df17f400dbf4630709c915ef5.mailgun.org";

const from_who = "REACT-STOCK@email.com";

//const db          = require("./db")
// Seperated Routes for each Resource
//const usersRoutes = require("./routes/users")

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// "dev" = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

app.use(morgan("dev"))

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex))

app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true}))
// app.use("/styles")
app.use(express.static("public"))
//app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")) // redirect bootstrap JS

app.use(require("body-parser").urlencoded({ extended: true}))

app.use(require("express-session")({ secret: "moist", resave: false, saveUninitialized: false}))

// Mount all resource routes
//app.use("/api/users", usersRoutes(knex))

console.log ("HERE - get")
  let arr = [];
  let arr2 = [];
  knex("users")
  .join("user_symbols", "users.id", "=", "user_symbols.user_id")
  //.where({user_id: req.params.user_id})
  .where({user_id: 54})
  .andWhere("favorite", true)
  .select("symbol")
  .then((results) => {
console.log(results);
    results = results.map(function(o){
console.log(o);
      for(let i in o){
console.log(i);
console.log(o[i]);
         arr.push(o[i])
      }
    });
console.log(arr);
  })

