const express = require('express')
const app = express()
const port = 8500

app.get('/', (req, res) => res.send('hello world!'))

app.listen(port, () => console.log(`Listening on port ${port}`))
