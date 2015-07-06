
var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic(__dirname, {'index': ['index.html']}));

app.listen(3000, function() {
    console.log("Your local server is accessible via http://localhost:3000");
});