var express = require('express')

// create an instance of app
var app = express()

// define a route
app.get('/', function(req, res) {
  res.send('Hello, world!')
})

// start the server on port 3000
var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})

