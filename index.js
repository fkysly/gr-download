var fs = require('fs')

var request = require('request')
var async = require('async')
var ProgressBar = require('progress')

var times = fs.readFileSync('time.json', 'utf-8').split('\n')

var progressBar = new ProgressBar('[:bar] :percent :elapseds', { 
    complete: '\u001b[42m \u001b[0m',
    incomplete: ' ',
    total: times.length
  })
progressBar && progressBar.tick(0)

async.mapLimit(times, 2, fetch_data, function(err, results) {
	console.log('程序结束')
})

function fetch_data(time, callback) {
	var file_name = time + '.json.gz'

	var res = request('http://data.githubarchive.org/' + file_name)
	res.pipe(fs.createWriteStream('data/' + file_name))
	res.on('end', function() {
		progressBar && progressBar.tick(1)
		return callback()
	})
}