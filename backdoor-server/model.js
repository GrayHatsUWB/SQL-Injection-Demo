const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const dbPath = 'database.db'

var dbExists = fs.existsSync(dbPath)
var db = new sqlite3.Database(dbPath)

// Create all the tables if loading the database for the first time.
if (!dbExists) {
  // Don't surround with try/catch; no way to handle this error.
  var data = fs.readFileSync('tables.sql')
  db.run(String(data))
}

module.exports = {
  db: db
}
