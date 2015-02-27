var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var mongoose = require('mongoose');

// Define schema, these are sort of like migrations and model associations
var userSchema = mongoose.Schema({
  email: {type: String, required: true, index: {unique: true, dropDups: true}},
  password: {type: String, required: true}
});

// Custom validation
userSchema.path('email').validate(function (value) {
  return /^[\w+]*@\w*\.\w*$/.test(value);
}, 'Invalid email');

// Model instance methods
// Methods have to come before the .model() call
userSchema.methods.gravatar = function () {
  return md5.update(this.email).digest('hex');
};

module.exports = mongoose.model('User', userSchema)