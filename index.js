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
  console.log(users)
})

// define a route, which console logs all requests, then sends it off to
// other route handlers
app.get('/:anything', function(req, res, next) {
  console.log('GET ' + req.url)
  next()
})

app.get('/', function(req, res, next) {

  var buffer = users.reduce(function(acc, user) {
    acc += '<a href="/' + user.username + '">' + user.name.full + '</a></br>'
    return acc
  }, '')
  res.send(buffer)
})

app.get('/:username', function(req, res) {
  var username = req.params.username
  res.send(username)
})

// start the server on port 3000
var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})
