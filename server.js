var express = require('express');

// Create app server
var app = express();

// heroku port || local port
app.listen(process.env.PORT || 3333);

// If static asset requested, serve it directly
app.get('/*.(css|js|png|jpg|gif|pdf|htm|html)', function(request, response) {
  response.sendfile('public/' + request.path);
});

// Otherwise, always serve index.html (app container)
app.get('/*', function(request, response) {
  response.sendfile('public/index.html');
});

