const express = require('express')
const fs = require('fs')
const session = require('express-session')
const child_process = require('child_process')

const auth = require('./auth')
const model = require('./model')

const app = express()
const port = 8500

const sess = {
  secret: "DQWGDn3sSUH8VoawWKeMQEPLITDV8Hld",
  resave: false,
  saveUninitialized: false,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(express.urlencoded({extended: true})) // Use URL-Encoded bodies sent by HTML forms

app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', {account: req.session.account}))

app.get('/login', (req, res) => res.render('login', {
  account:req.session.account,
  failed:false}))

app.post('/login', function (req, res, next) {
  auth.checkPassword(req.body.username, req.body.password, function (err, ok) {
    if (err) {
      next(err)
      return
    }

    if (!ok) {
      req.session.account = null

      res.render('login', {account:req.session.account, failed:true})
      return
    }

    auth.isAdmin(req.body.username, function (err, ok) {
      if (err) {
        next(err)
        return
      }

      req.session.account = {
        username: req.body.username,
        isAdmin: ok
      }

      // Redirect to front page
      if (req.body.username === 'dave') {
        res.redirect('/sql')
      } else {
        res.redirect('/')
      }
    })
  })
})

app.get('/logout', function (req, res) {
  req.session.account = null
  res.redirect('/')
})

app.get('/scores', function (req, res, next) {
  model.getScore(function(err, scores) {
    if (err) {
      next(err)
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(scores))
    }
  })
})


// Any person whoever builds a page like this in a real-world project
// should reflect deeply in their mirror what forced forced their hand
// to make this.
app.get('/sql', function (req, res) {
  if (req.session.account && req.session.account.username === 'dave') {
    res.render('sql', {account: req.session.account})
  } else {
    res.redirect('/')
  }
})

app.post('/sql', function (req, res, next) {
  if (req.session.account && req.session.account.username === 'dave') {
    let process = child_process.spawnSync('sqlite3', [model.path], {
      input: req.body.query,
      stdio: 'pipe'
    })
    let data = String(process.stdout)
    console.log(data)
    res.render('sql', {
      account: req.session.account,
      data: data
    })
  } else {
    res.redirect('/')
  }
})

app.use(express.static('static'))

// DB Initialization
if (model.firstRun) {
  model.db.run(
    'CREATE TABLE account (' +
      ' username TEXT NOT NULL PRIMARY KEY,' +
      ' hash TEXT NOT NULL,' +
      ' isadmin INTEGER NOT NULL DEFAULT 0)',
    function (err) {
      if (err) throw err

      auth.createAccount('mark', 'ijefkdf', false)
      auth.createAccount('dave', 'hunter2', false)
      auth.createAccount('admin', 'hdke', true)
      auth.createAccount('marvin', 'ksjdfklsdjfkljfksad', false)
    })

  model.db.run(
    'CREATE TABLE score (' +
      ' team TEXT NOT NULL PRIMARY KEY,' +
      ' score INTEGER NOT NULL)',
    function (err) {
      if (err) throw err

      model.db.run('INSERT INTO score (team, score) VALUES' +
                   ' ("Red", 95),' +
                   ' ("Blue", 25),' +
                   ' ("Green", 90)')
    })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
