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
				  var arr = data.toString().split(" ");
				  var raw = arr[3];
				  var ip_str = raw.split(":");
				  var h = ip_str[0];
				  var p = ip_str[1];
          var opt = {host:h, port:p};
          let old_lat = req.session.coords[0];
          let old_lon = req.session.coords[1];
				  var client = net.createConnection(opt, () =>
				  {
            client.write(old_lat + " " + lat + " " + old_lon + " " + lon + "\n");
          });
          let incoming = '';
          client.on('data', (stuff) =>
          {
              incoming += stuff;
              client.end();
          });
          client.on('end', () =>
          {
            req.session.coords[0] = lat;
            req.session.coords[1] = lon;
            res.end("The distance from (" + old_lat + "," + old_lon + ")"
            + " to (" + lat + "," + lon + ") is " + incoming);
          });
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

  /*
  Parameters:
  <from>: the origin address
  <to>: the destination address
  Sample addresses: (Use verbatim, URLs do not take spaces)
  4700+Keele+St,+Toronto,+ON+M3J1P3
  220+Yonge+St,+Toronto,+ON+M5B2H1
  */
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
        res.writeHead(200, { 'Content-Type': 'text/plain'});
        data = JSON.parse(data);

          //extracting back the destination and origin
        var dest = (data.destination_addresses)[0];
        var org = (data.origin_addresses)[0];

          //drilling down to the distance and duration
        var rows = data.rows;
        var elements = rows[0];
        var elements_ = elements.elements;
        var elements0 = elements_[0];
        var distance = elements0.distance;
        var d_text = distance.text;
        var duration = elements0.duration;
        var dur_text = duration.text;

        res.end("The distance from: <" + org + "> to: <" + dest
        + "> is: " + d_text + " and will take: " + dur_text);
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
