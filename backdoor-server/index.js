const express = require('express')
const app = express()
const port = 8500

app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index'))
app.use(express.static('static'))
app.listen(port, () => console.log(`Listening on port ${port}`))
