var express = require('express');
var app = express();

app.listen(process.env.PORT || 3333);
app.get('/*.(css|js|png|jpg)', function(request, response) {
  response.sendfile('public/' + request.path);
});
app.get('/*', function(request, response) {
  response.sendfile('public/index.html');
});

