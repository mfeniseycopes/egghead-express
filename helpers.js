var path = require('path')
var fs = require('fs')
var _ = require('lodash')

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

exports.getUserFilePath = getUserFilePath
exports.getUser = getUser
exports.saveUser = saveUser
exports.deleteUser = deleteUser
exports.verifyUser = verifyUser
