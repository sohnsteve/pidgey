/*
Client provides one or two URL-encoded parameters called:
type1
type2 (if applicable)
and typeWeakness will return all types that the provided types are
weak to (vulnerable to super effect)

e.g., 
client provides:
type1 = fire
then the return types are:
water, ground
That is, a fire type Pokemon will be weak to water and ground

e.g., 
client provides:
type1 = flying
type2 = normal
then the return types are:
Electic, 
*/

const http = require('http');
const express = require('express');
var app = express();

//const hostname = '127.0.0.1';
const port = 3000;

var type1 = '';
var type2 = '';

app.use(session(
    {
      secret: "mine",
      proxy: true,
      resave: true,
      saveUninitialized: true
    }));

app.use('/typeWeakness', function(req, res)
{
    type1 = req.query.type1;
    type2 = req.query.type2;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    if (type2 == null)
    {
        //single-typed pokemon
        res.end("A single-typed Pokemon, namely: " + type1);
    }
});

var server = app.listen(port, function()
  {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%d', host, port);
  });