var express = require('express');
var path		= require('path');

// Create app server
var app = express();

// heroku port || local port
app.listen(process.env.PORT || 3333);

// If static asset requested, serve it directly
app.get('/*.(css|js|png|jpg|gif)', function(request, response) {
  response.sendfile('public/' + request.path);
});

// Otherwise, always forward to index.html
app.get('/*', function(request, response) {
  response.sendfile('public/index.html');
});

