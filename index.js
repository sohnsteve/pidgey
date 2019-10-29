const port = 0;
  const home = '/cs/home/stevsohn';
  const DB_PATH = home + '/4413/pkg/sqlite/Models_R_US.db';

  const net = require('net');
  const https = require('https');
  const express = require('express');
  const session = require('express-session');
  const fs = require('fs');

  var app = express();
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(DB_PATH);
  app.enable('trust proxy');

  // Testing middleware for url mapping route:  http://host:port/Test?x=123
  app.use('/Test', function(req, res)
  {
     res.writeHead(200, { 'Content-Type': 'text/html'});
     res.write("Hello ... this is EECS4413/Fall19 Tester! ");
     res.end("You sent me: " + req.query.x);
  });


  app.use(session(
  {
    secret: "mine",
    proxy: true,
    resave: true,
    saveUninitialized: true
  }));

  app.use('/GeoNode', function(req, res)
  {
	  let lat = req.query.lat;
	  let lon = req.query.lon;
	  if (!req.session.coords)
	  {
		  req.session.coords = [];
		  req.session.coords.push(lat);
		  req.session.coords.push(lon);
      res.writeHead(200, { 'Content-Type': 'text/plain'});
      res.write("lat =" + lat);
      res.end("RECEIVED");
	  }
	  else
	  {
		  //Must open TCP connection to Geo.java
		  res.writeHead(200, { 'Content-Type': 'text/plain'});
		  fs.readFile(home + '/4413/ctrl/geo.txt', (err, data) =>
			  {
				  if (err)
				  {
					  res.end("Error " + err);
				  }
				  res.write(data);
				  var arr = data.toString().split(" ");
				  var raw = arr[3];
				  var ip_str = raw.split(":");
				  var h = ip_str[0];
				  var p = ip_str[1];
          var opt = {host:h, port:p};
				  var client = net.createConnection(opt, () =>
				  {
            res.write("The lat is " + req.session.coords[0] + " and the lon is " + req.session.coords[1]);
            client.write(req.session.coords[0] + " " + req.query.lat + " " + req.session.coords[1] + " " + req.query.lon);
          });
          let incoming = '';
          client.on('data', (stuff) =>
          {
              incoming += stuff;
              client.end();
          });
          client.on('end', () =>
          {
            res.end("The distance is " + incoming);
            req.session.coords[0] = lat;
		        req.session.coords[1] = lon;
          });
         /*
          var client = require('net').Socket();
          client.connect(p, h);
          client.on('connect', () =>
          {
            client.write(req.session.coords[0] + " " + req.query.lat + " " + req.session.coords[1] + " " + req.query.lon);
          });
          client.on('data', (data) =>
          {
            res.end("DATA: " + data);
            client.end();
          });
          */
			  });
	  }
  });  

  app.use('/Catalog', function(req, res)
  {
    let id = req.query.id;
    if (id == null) //id not provided by client
    {
      let query = "select id, name from category";
      db.all(query, (err, rows) =>
      {
		    if (err == null)
		    {
          res.writeHead(200, { 'Content-Type': 'application/json'});
			    res.write(JSON.stringify(rows));
		  	  res.end();
		    }
		    else
		    {
		  	  res.end("Error " + err);
		    }
      });
    }
    else
    {
      let query = "select id, name from category where id = ?";
      db.all(query, [id], (err, rows) =>
      {
		    if (err == null)
		    {
          res.writeHead(200, { 'Content-Type': 'application/json'});
			    res.write(JSON.stringify(rows));
		  	  res.end();
		    }
		    else
		    {
		  	  res.end("Error " + err);
		    }
      });
    }
  });

  app.use('/Trip', function(req, res)
  {
    let f = req.query.from;
    let t = req.query.to;
    https.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+f+'&destinations='+t+
      '&key=AIzaSyByat45S9vL1z91JabosN-IwOsJPb-F6ac&departure_time=now', (resp) => 
    {
      let data = '';
      resp.on('data', (x) => 
      {
        data += x;
      });
      resp.on('end', () => 
      { 
        res.writeHead(200, { 'Content-Type': 'application/json'});
			  res.write(JSON.stringify(data));
		  	res.end();
      })
    }).on("error", (err) => { res.end(err) });
  });

  // --------------------------------------SERVER
  var server = app.listen(port, function()
  {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%d', host, port);
  });
