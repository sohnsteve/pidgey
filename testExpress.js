const port = 0;
const express = require('express');

var app = express();

var server = app.listen(port, function()
{
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening at http://%s:%d', host, port);
});
