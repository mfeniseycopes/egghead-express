var express = require('express')
var fs = require('fs')
var _ = require('lodash')

// create an instance of app
var app = express()

// read some dummy data
let users = []
fs.readFile('users.json', { encoding: 'utf8' }, function(err, data) {
  if (err) throw err

  users = JSON.parse(data).map(function(user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    return user
  })
})

// when we render a view look here
app.set('views', './views')
// use this engine
// jade is a haml-like engine
app.set('view engine', 'jade')

// define a route, which console logs all requests, then sends it off to
// other route handlers
app.get('/:anything', function(req, res, next) {
  console.log('GET ' + req.url)
  next()
})

app.get('/', function(req, res, next) {
  res.render('index', { users: users })
})

app.get('/:username', function(req, res) {
  var username = req.params.username
  res.send(username)
})

// start the server on port 3000
var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})
