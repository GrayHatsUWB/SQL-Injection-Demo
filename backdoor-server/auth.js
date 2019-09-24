const bcrypt = require('bcrypt')
const db = require('./model').db
const saltRounds = 10

function createAccount(username, plaintextPass, isAdmin, callback) {
  bcrypt.hash(plaintextPass, saltRounds, function (err, hash) {
    if (err) {
      if (callback) callback(err)
      return
    }

    let stmt = db.prepare("INSERT INTO account (username, hash, isadmin) VALUES (?,?,?)")
    stmt.run(username, hash, isAdmin)
    if (callback) callback(null)
  })
}

function checkPassword(username, plaintextGuess, callback) {
  let stmt = db.prepare("SELECT hash FROM account WHERE username=?")
  stmt.get(username, function (err, row) {
    if (err) {
      callback(err)
      return
    } else if (row === undefined) {
      // Username not found
      callback(null, false)
      return
    }

    bcrypt.compare(plaintextGuess, row.hash, function (err, res) {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  })
}

function isAdmin(username, callback) {
  let stmt = db.prepare("SELECT isadmin FROM account WHERE username=?")
  stmt.get(username, function (err, row) {
    if (err) {
      callback(err)
      return
    }

    // SQLite stores booleans as integers of 1 or 0.
    let isAdmin = (row.isadmin === 1) ? true : false

    callback(null, isAdmin)
  })
}

module.exports = {
  createAccount: createAccount,
  checkPassword: checkPassword,
  isAdmin: isAdmin
}
