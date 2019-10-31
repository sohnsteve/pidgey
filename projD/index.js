const port = 0; // put 8000 on workstation, 0 on red
  const home = '/cs/home/stevsohn'; // put your username
  const express = require('express');
  var app = express();

  app.use('/static', express.static(home + "/projD/static"));

  // --------------------------------------SERVER
  var server = app.listen(port, function()
  {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%d', host, port);
  });