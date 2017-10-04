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

// Loads the page and initializes keys and data
function renderHelper(req, res) {
  let templateVars = {}
  let whereClause = ""

  if (req.user) {
    templateVars = {
      user: req.user
    }
    whereClause = {user_id: req.user.id,
      favorite: true
    }
  } else {
    templateVars = {
      user: {
        id:1,
        name:"tak",
        email:"tak@guest.com",
        password:"tak"
      }
    }
    whereClause = {
      user_id: 1,
      favorite: true
    }
  }

  knex("user_symbols")
  .where(whereClause)
  .select("symbol")
  .then((results) => {
    templateVars["favorites"] = results
    res.render("index", templateVars)
  })
}

//app.delete("/symbol/:user_id/:symbol", (req, res) => {
app.post("/symbol/:user_id/:symbol", (req, res) => {
  knex("user_symbols")
    .where({
      user_id: req.params.user_id,
      symbol: req.params.symbol
    })
    .del()
    .then(() => {
    })
})

// app.post("/user_symbol", (req, res)=>{
app.post("/ins_user_symbol/:user_id/:symbol", (req, res) => {
console.log (req.body.user_id)
console.log (req.body.symbol)

  knex("user_symbols")
    .insert(
    {
     // user_id      : req.body.user_id,
     // symbol       : req.body.symbol,
     user_id      : req.params.user_id,
     symbol       : req.params.symbol,
     favorite     : 1
    })
    .returning("id")
    .then((id) => {
      res.send(id)
    })
})

app.get("/symbols/:user_id", (req, res) => {
console.log ("HERE - get")
console.log (req.params.user_id)
  let arr = [];
  knex("users")
  .join("user_symbols", "users.id", "=", "user_symbols.user_id")
  .where({user_id: req.params.user_id})
  // .where({user_id: 54})
  .andWhere("favorite", true)
  .select("symbol")
  .then((results) => {
    //results.map(arr => Object.values(arr));
    res.json(results)
//    results = results.map(function(o){
//      for(let i in o){
//         arr.push(o[i])
//      }
//    });
    res.json(arr)
  })
  .catch(function(error) {
    console.log(error)
  })
})

// Gets all users
app.get("/users", (req, res) => {
  knex("users")
  .then((results) => {
    res.json(results)
  })
  .catch((error) => {
    console.log(error)
  })
})

/*
app.get("/users", (req, res) => {
  knex("users")
  .then((results) => {
    let users = results
    results.forEach(function(user) {
      knex('users')
      .join("user_symbols", "users.id", "=", "user_symbols.user_id")
      .where({user_id: user.id})
      .andWhere("favorite", true)
      .select("symbol")
      .then((results) => {
        users = users.map((u) => {
          if (u.id == user.id) {
            u.symbols = results
          }
          return u
        })
      }).then(() => {
        res.json(users)
      })
    })
    // res.json(results)
  })
  .catch((error) => {
    console.log(error)
  })
})
*/

// Home page
app.get("/", (req, res) => {
  renderHelper(req, res)
})

// Login
//app.post("/login",
 // passport.authenticate("local", { successRedirect: "/",
  //  failureRedirect: "/"
  //}))

app.get("/login/:name/:password", (req, res) => {
  knex("users")
  .where({name: req.params.name})
  .andWhere({password: req.params.password})
  .select("id")
  .then((results) => {
    res.json(results)
  })
  .catch(function(error) {
    console.log(error)
  })
})

// Price all_fluctuate
app.get("/all_fluctuate/:user_id", (req, res) => {
  let arr = [];
  knex("users")
  .join("user_symbols", "users.id", "=", "user_symbols.user_id")
  .where({user_id: req.params.user_id})
  // .where({user_id: 54})
  .andWhere("favorite", true)
  .select("symbol")
  .then((results) => {
    // res.json(results)
    results = results.map(function(o){
      for(let i in o){
         arr.push(o[i])
	  console.log(req.params)
	  console.log(req.params.email)
	  console.log(req.params.symbol)
          let mailgun = new Mailgun({ apiKey: api_key, domain: domain });
          let data = {
            from: from_who,
            //to: req.params.email,
            to: "takng789+test@gmail.com",
            // subject: req.params.symbol,
            subject: o[i],
            text: "REACT-STOCK price fluctuate more than 1%, be alert."
          };

          mailgun.messages().send(data, function(err, body) {
	    let msg = 'Email sent';
            if (err) {
              console.log("ERROR: ", err);
              console.log("ERROR BODY: ", body);
  	      msg = 'Error occured'
            } 
	    console.log(body)
	    res.json({message: msg })
          });
        }
      })
    });
    res.json(arr)
  .catch(function(error) {
    console.log(error)
  })
})

// Price fluctuate
app.post("/fluctuate/:symbol/:email", (req, res) => {
	  console.log(req.params)
	  console.log(req.params.email)
	  console.log(req.params.symbol)
          let mailgun = new Mailgun({ apiKey: api_key, domain: domain });
          let data = {
            from: from_who,
            to: req.params.email,
            subject: req.params.symbol,
            text: "REACT-STOCK price fluctuate more than 1%, be alert."
          };

          mailgun.messages().send(data, function(err, body) {
	    let msg = 'Email sent';
            if (err) {
              console.log("ERROR: ", err);
              console.log("ERROR BODY: ", body);
  	      msg = 'Error occured'
            } 
	    console.log(body)
	    res.json({message: msg })
          });
        })


// Register
app.post("/register/:name/:email/:password",
  (req, res) => {
    knex("users")
    .count("name")
    .where("name", req.params.name)
    .then((results) => {
      if(results[0].count == 0){
        knex("users")
        .insert({
          name: req.params.name,
          email: req.params.email,
          password: req.params.password
        })
        .returning("id")
        .then((id) => {
 	  console.log(req.params)
          let mailgun = new Mailgun({ apiKey: api_key, domain: domain });
          let data = {
            from: from_who,
            to: req.params.email,
            subject: "REACT-STOCK User ID created",
            text: "REACT-STOCK User ID created, have fun."
          };

          mailgun.messages().send(data, function(err, body) {
	    let msg = 'Email sent';
            if (err) {
              console.log("ERROR: ", err);
              console.log("ERROR BODY: ", body);
  	      msg = 'Error occured'
            } 
	    console.log(body)
	    // res.json({message: msg })
          });

          res.send(id)
        })
      }
    })
  })

// Logout
app.get("/logout",
  function(req, res){
    req.logout()
    res.redirect("/")
  })

app.listen(PORT, () => {
  console.log("DB-STOCK listening on port " + PORT)
})
