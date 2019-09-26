const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const dbPath = 'database.db'

var firstRun = !fs.existsSync(dbPath)
var db = new sqlite3.Database(dbPath)

function runFileSync(db, filepath) {
  return
}

function getScore(callback) {
  db.all('SELECT team, score FROM score', function (err, rows) {
    if (err) {
      callback(err)
      return
    }

    callback(null, rows)
  })
}

module.exports = {
  db: db,
  firstRun: firstRun,
  getScore: getScore,
  path: dbPath
}
