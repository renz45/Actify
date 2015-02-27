// Load routes
module.exports = function(app) {
  // Root route
  app.get('/', function(req, res){
    res.sendfile('index.html', {root: app.settings.views});
  });

  // require('./routes/user')(app); //user routes
  // require('./routes/note')(app); // note routes
  // require('./routes/category')(app); // category routes
}
