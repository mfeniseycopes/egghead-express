var express = require('express')
var engines = require('consolidate')
var bodyParser = require('body-parser')
var helpers = require('./helpers')
var fs = require('fs')
var path = require('path')
var _ = require('lodash')

// create an instance of app
var app = express()

// whenever we see an extension with 'hbs' use engines.handlebars engine
// while jade extensions are supported by express, hbs is not, so we need
// to explicitly define it
app.engine('hbs', engines.handlebars)

// when we render a view look here
app.set('views', './views')

// use this engine
// handlebars is is a html engine
app.set('view engine', 'hbs')

// any assets, look inside 'images' directory 
// app.use(express.static('images'))
// any assets prefixed with '/profilepics', look in the 'images' directory
app.use('/profilepics', express.static('images'))

// our data will be urlencoded, do all the parsing it can
app.use(bodyParser.urlencoded({ extended: true })) 
// define a route, which console logs all requests, then sends it off to
// other route handlers
app.get('/:anything', function(req, res, next) {
  console.log('GET ' + req.url)
  next()
})

app.get('/', function(req, res, next) {
  // fetch users from '/users' on page load, not server load
  var users = []
  fs.readdir('users', function (err, files) {
    files.forEach(function (file) {
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, function (err, data) {
        var user = JSON.parse(data)
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
        users.push(user)
        if (users.length === files.length) res.render('index', {users: users})
      })
    })
  })
})

app.get('/data/:username', function(req, res) {
  var username = req.params.username
  var readable = fs.createReadStream('./users/' + username + '.json')
  // non-blocking pipe of user's file into response
  readable.pipe(res)
})

app.get('/error', function(req, res) {
  res.status(404).send('ERROR: ' + req.query.from + ' does not exist!')
})

app.get('/favicon.ico', function(req, res) {
	res.send('No favicon, stop asking')
})

// string pattern route
app.get('*.json', function(req, res) {
  res.download('./users' + req.path)
})

var userRouter = require('./username')
app.use('/:username', userRouter)

app.get('/:missing', function(req, res) {
  res.send('WHOOOPS! That user isn\'t available')
})

// start the server on port 3000
var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})
