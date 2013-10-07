var express = require('express')
var exec    = require('child_process').exec;

// Initialize app stack
var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger());

app.get('/mgn-crawl', function(req, res) {
  exec('ruby ./crawl.rb > crawler.out.log', function(err, stdout, stderr) {
	  console.log(err);
	  console.log(stdout);
	  console.log(stderr);
  });
  res.send('Running...');
});

app.listen(4242);