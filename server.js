var express = require('express');
var sys = require('sys');
var exec = require('child_process').exec;

// Create app server
var app = express();

// heroku port || local port
app.listen(process.env.PORT || 3333);

app.get('/crawl', function(request, response) {
  exec("ruby ./crawler/crawl.rb > ./crawler/crawler.out.log");
  response.sendfile('public/index.html');
});

// If static asset requested, serve it directly
app.get('/*.(css|js|png|jpg|gif|pdf|htm|html)', function(request, response) {
  response.sendfile('public/' + request.path);
});

// Otherwise, always serve index.html (app container)
app.get('/*', function(request, response) {
  response.sendfile('public/index.html');
});

