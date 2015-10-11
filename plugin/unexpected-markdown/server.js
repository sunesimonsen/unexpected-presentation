require('../../bootstrap-unexpected-markdown');
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
    var markdown = new UnexpectedMarkdown(req.body.markdown);
    markdown.toHtml({ preferredWidth: 75 }, function (err, html) {
      if (err) {
        console.log(err);
        res.send(err.message);
      } else {
        res.send(html);
      }
    });
});

// Actually listen
app.listen( opts.port || null );
