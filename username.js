var express = require('express')
var helpers = require('./helpers')

// does not receive route params by default
var router = express.Router({
  mergeParams: true,
})

router.all('/', function(req, res, next) {
  console.log(req.method, 'for', req.params.username)
  next()
})

// will go through helpers.verifyUser, then anonymous function
router.get('/', helpers.verifyUser, function(req, res) {
  var username = req.params.username
  var user = helpers.getUser(username)
  res.render('user', { user: user, address: user.location })
})

router.put('/', function(req, res) {
  var username = req.params.username
  var user = helpers.getUser(username)
  // req.body will be the data object passed into ajax req
  user.location = req.body.location
  helpers.saveUser(username, user)
  res.end()
})

router.delete('/', function(req, res) {
  var username = req.params.username
  helpers.deleteUser(username)
  res.sendStatus(200)
})

module.exports = router
