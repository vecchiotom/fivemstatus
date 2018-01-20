const express = require('express');
const path = require('path');
const request = require('request');
const status = require('./status.js');
const PORT = process.env.PORT || 5000;
var exphbs  = require('express-handlebars');
const co = require('co');
const generate = require('node-chartist');
const fs = require('fs')
var pattern = require("patternomaly")

status.start();

var app = express()
  .use(express.static(path.join(__dirname, 'public')))
  

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, "views/index.html"))
})

app.get('/json', (req, res) => {
  res.json(status.getStatus())
})
app.get('/chart', (req,res) => {
	var times = []
	function GetLast() {
		var file = JSON.parse(fs.readFileSync(path.join(__dirname,'public',req.query.file + "_time.json")))
		var c = 0
		for (var i = file.length - 1; i >= 0; i--) {
			if (c == 15) {
				break
			}
			c = c+1

			times.push(file[i])
		}
		return times
	} 
	console.log(GetLast())
	co(function * () {

  // options object
  const options = {width: 600, height: 120,
  
  showGridBackground: true,
  
  axisX: {
    showLabel: true,
    showGrid: false
	}
  };
  const data = {
    labels: [],
    series: [
      GetLast()
      
    ],
     
  };
  const bar = yield generate('line', options, data); //=> chart HTML
console.log(bar)
res.send(`
	<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link rel="stylesheet" type="text/css" href="http://127.0.0.1:5000/charts.css">
<body>
`+bar+`
</body>
</html>



	`)
times = []

});
	times = []
})

app.get('/pie', (req,res) =>{
		var file = JSON.parse(fs.readFileSync(path.join(__dirname,'public',req.query.file + "_up.json")))
		var down = 0
		var up = 0
		var tot = file.length
	function CountUpTime() {

		for (var i = 0; i < file.length; i++) {
			if (file[i] == 1) {
				up +=1
			} else {
				down+=1
			}
		}
		console.log(up,down,tot)
	}
	CountUpTime()
  res.json({uptime: up, downtime:down})

})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
