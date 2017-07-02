var express = require('express')

// create an instance of app
var app = express()

// define a route, which console logs all requests, then sends it off to
// other route handlers
app.get('/:anything', function(req, res, next) {
  console.log(req)
  next()
})

app.get('/', function(req, res, next) {
  res.send('Hello World!')
})

app.get('/yo', function(req, res) {
  res.send('Yo!')
})

// start the server on port 3000
var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})

