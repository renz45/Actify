// Load routes
module.exports = function(app) {
  // Root route
  app.get('/', function(req, res){
    debugger
    res.render('index.hbs', {user: req.user});
  });

  require('./routes/session')(app)
  // require('./routes/user')(app); //user routes
  // require('./routes/note')(app); // note routes
  // require('./routes/category')(app); // category routes
}
