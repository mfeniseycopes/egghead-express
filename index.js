var express = require('express')
var fs = require('fs')
var _ = require('lodash')
var engines = require('consolidate')

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

// whenever we see an extension with 'hbs' use engines.handlebars engine
// while jade extensions are supported by express, hbs is not, so we need
// to explicitly define it
app.engine('hbs', engines.handlebars)

// when we render a view look here
app.set('views', './views')

// use this engine
// handlebars is is a html engine
app.set('view engine', 'hbs')

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
