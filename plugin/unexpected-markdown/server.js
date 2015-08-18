var UnexpectedMarkdown = require('unexpected-markdown');
var express = require('express');
var bodyParser = require('body-parser');
var app = express.createServer();

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var opts = {
	  port :      1949,
	  baseDir :   __dirname + '/../../'
};

app.post('/', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.body.markdown);
    var markdown = new UnexpectedMarkdown(req.body.markdown);
    markdown.toHtml({ }, function (err, html) {
        res.send(html);
    });
});

// Actually listen
app.listen( opts.port || null );
