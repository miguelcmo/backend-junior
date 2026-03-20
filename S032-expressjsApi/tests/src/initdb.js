const initDB = require("./database/db");

let db;

initDB().then(database => {

  db = database;

  console.log("Database ready");

});