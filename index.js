var routes = require("./server/routes");
var port = process.env.PORT || 8000;
var express = require('express');
var app = express();
var settings = require('./server/settings');

module.exports = {
  settings: settings,
  init: function(){
    // Connect to our mongo database
    require('./server/database')('mongodb://localhost/actify');

    // Load express config
    require('./server/expressConfig')(app, express);

    // Load routes
    require("./server/routes")(app);

    console.log("LOADING ACTIFY TEST");

    // Start the server
    var server = app.listen(port, function() {
     console.log('Listening on port %d', server.address().port);
    });
  }
}