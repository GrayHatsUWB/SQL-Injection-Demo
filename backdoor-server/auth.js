const bcrypt = require('bcrypt')
const db = require('./model').db
const saltRounds = 10

function createAccount(username, plaintextPass, isAdmin, callback) {
  bcrypt.hash(plaintextPass, saltRounds, function (err, hash) {
    if (err) {
      if (callback) callback(err)
      return
    }

    let stmt = db.prepare("INSERT INTO account (username, passwd, isadmin) VALUES (?,?,?)")
    stmt.run(username, plaintextPass, isAdmin)
    if (callback) callback(null)
  })
}

function checkPassword(username, plaintextGuess, callback) {
  let stmt = db.prepare("SELECT passwd FROM account WHERE username=?")
  stmt.get(username, function (err, row) {
    if (err) {
      callback(err)
    } else if (row === undefined) {
      // Username not found
      callback(null, false)
    } else {
      callback(null, plaintextGuess === row.passwd)
    }
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
