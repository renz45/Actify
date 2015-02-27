var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var passport = require('passport');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var settings = require('./settings');
var path = require('path');

module.exports = function(app, express) {
  console.log("view path: ", settings.viewsPath)
  // Set the view directory, this enables us to use the .render method inside routes
  app.set('views', settings.viewsPath);

  // Set handlebars as the templating engine
  app.engine('hbs', expressHandlebars({
    extname: "hbs",
    defaultLayout: 'main',
    layoutsDir: path.join(settings.viewsPath, "layouts")
    // partialsDir: path.join(settings.viewsPath, "partials")
  }));

  app.set('view engine', 'hbs');

  // Disable etag headers on responses
  // app.disable('etag');

  // Set /assets as our static content dir
  app.use("/", express.static(__dirname + "../app/assets/"));

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  // Setup cookie sessions
  app.use(cookieParser());
  app.use(cookieSession({secret: 'Super secret, this should be something super secure'}));

  // Add CSRF token to requests to secure our ajax requests from the angular.js app
  app.use(csrf());

  // This is a little custom middleware which adds the csrf token to local variables
  // which can be used used within ejs template forms by doing something like:
  // <form>
  //   <input type="hidden", name="_csrf", value='<%-csrfToken%>'>
  //   ... other inputs and submit buttons
  // </form>
  //
  // Setting the: res.cookie('XSRF-TOKEN', req.csrfToken()); is for angularJS
  // AngularJs looks for this cookie, and if it exists it sends it along with each
  // ajax request made with the $http service.
  app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });

  // Initialize passport middleware for user authentication
  app.use(passport.initialize());
  app.use(passport.session());
}
