var express = require('express')
var fs = require('fs')
var _ = require('lodash')
var engines = require('consolidate')
var bodyParser = require('body-parser')
var path = require('path')

// create an instance of app
var app = express()

function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json'
}

function getUser(username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}))
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
  _.keys(user.location).forEach(function (key) {
    user.location[key] = _.startCase(user.location[key])
  })
  return user
}

function saveUser (username, data) {
  var fp = getUserFilePath(username)
  fs.unlinkSync(fp) // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'})
}

function deleteUser (username) {
  var fp = getUserFilePath(username)
  fs.unlinkSync(fp) // delete the file
}

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

app.get('/error', function(req, res) {
  res.status(404).send('ERROR: ' + req.query.from + ' does not exist!')
})

app.get('/favicon.ico', function(req, res) {
	res.send('No favicon, stop asking')
})

function verifyUser(req, res, next) {
	var username = req.params.username
	var fp = getUserFilePath(username)
	fs.exists(fp, function(yes) {
		if (yes) {
			next()
    } else {
      // skip the next handler for this route and move to next defined route
      // next('route')
      // use redirect method to go to specific path
      res.redirect('/error?from=' + req.url)
		}	
	})
}

// string pattern route
app.get('*.json', function(req, res) {
  res.download('./users' + req.path)
})

app.route('/:username')
  .all(function(req, res, next) {
    console.log(req.method, 'for', req.params.username)
    next()
  })
  // will go through verifyUser, then anonymous function
  .get(verifyUser, function(req, res) {
    var username = req.params.username
    var user = getUser(username)
    res.render('user', { user: user, address: user.location })
  })
  .put(function(req, res) {
    var username = req.params.username
    var user = getUser(username)
    // req.body will be the data object passed into ajax req
    user.location = req.body.location
    saveUser(username, user)
    res.end()
  })
  .delete(function(req, res) {
    var username = req.params.username
    deleteUser(username)
    res.sendStatus(200)
  })

app.get('/:missing', function(req, res) {
  res.send('WHOOOPS! That user isn\'t available')
})

// start the server on port 3000
var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})
