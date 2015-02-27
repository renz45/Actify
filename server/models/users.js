var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var userSchema = mongoose.Schema({
  email: String,
  password: String
});

// Methods have to come before the .model() call
userSchema.methods.gravatar = function () {
  return md5.update(this.email).digest('hex');
};

module.exports = mongoose.model('User', userSchema)