var fs = require('fs')

var inputFile = './users.json'
var outpulFile = './out.json'

var readable = fs.createReadStream(inputFile)
var writeable = fs.createWriteStream(outputFile)

// pipe all the readable data into the writeable stream
// basically transfers data from users.json to out.json
readable.pipe(writeable)
