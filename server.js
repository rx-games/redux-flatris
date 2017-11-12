var express = require("express");
var gzip = require('compression')

var app = express();

app.use(gzip());

app.use('/',express.static("build"));

app.listen(process.env.PORT || 1313 );
