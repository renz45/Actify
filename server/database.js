var mongoose = require('mongoose');

module.exports = function(url){
  mongoose.connect(url);
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', function (callback) {
    console.log('Connected to mongodb at: ' + url);
  });
};
