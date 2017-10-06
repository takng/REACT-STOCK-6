"use strict"

require("dotenv").config()

const PORT        = 3002
const ENV         = process.env.ENV || "development"
//const express     = require("express")
//const bodyParser  = require("body-parser")
//const sass        = require("node-sass-middleware")
//const app         = express()
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

//app.use(morgan("dev"))

// Log knex SQL queries to STDOUT as well
//app.use(knexLogger(knex))

//app.set("views", __dirname + "/views")
//app.set("view engine", "ejs")
//app.use(bodyParser.urlencoded({ extended: true}))
// app.use("/styles")
//app.use(express.static("public"))
//app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")) // redirect bootstrap JS

//app.use(require("body-parser").urlencoded({ extended: true}))

//app.use(require("express-session")({ secret: "moist", resave: false, saveUninitialized: false}))

// Mount all resource routes
//app.use("/api/users", usersRoutes(knex))

// Price all_fluctuate

  let arr = [];
  knex("users")
  .join("user_symbols", "users.id", "=", "user_symbols.user_id")
  .andWhere("favorite", true)
  .select("symbol", "email")
  .then((results) => {
    results = results.map(function(o){
	    console.log(o)
      let cnt = 0;
      let symbol = "";
      let email = "";
      for(let key in o){
         arr.push(o[key])
         if (cnt == 0) {
           symbol = o[key]; 
           cnt = 1;
         }
         else {
           email = o[key]; 
           cnt = 0;
         }
//	    console.log(key)
//	    console.log(arr)
         if (cnt == 0) {

let request = require("request");

let stock_url = `https://query2.finance.yahoo.com/v7/finance/options/${symbol}`;
let stock_data = {};
let stocks = 0;

request(stock_url, function (error, response, body) { 
    if (!error && response.statusCode == 200) {  
       // var stock_data = body;
        stock_data = JSON.parse(body);
        stocks = stock_data.optionChain.result[0].quote;
        console.log("Yahoo Finance API symbol: ", symbol);
        console.log("stock_change_%: ", stocks.regularMarketChangePercent);       
    };

//         if(Math.abs(stocks.regularMarketChangePercent) > 1){
         if(Math.abs(stocks.regularMarketChangePercent) > 0.5){
          let mailgun = new Mailgun({ apiKey: api_key, domain: domain });
          let data = {
            from: from_who,
            to: email,
            subject: symbol,
//            text: "REACT-STOCK price fluctuate more than 1%, be alert."
            text: "REACT-STOCK price fluctuate more than 0.5%, be alert."
          };

          mailgun.messages().send(data, function(err, body) {
	    let msg = 'Email sent';
            if (err) {
              console.log("ERROR: ", err);
              console.log("ERROR BODY: ", body);
  	      msg = 'Error occured'
            } 
	    console.log(body)
          });
         } //if(Math.abs(stocks.regularMarketChangePercent) > 1)
});

         } // for(let key in o)

        }
      })
    });

//	    console.log(arr)
//process.exit() 

 



