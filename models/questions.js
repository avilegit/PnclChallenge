var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var questionSchema = new Schema({
  name: { type: String, Required:  'Topic name cannot be left blank.' },
  questions: []
});
module.exports = mongoose.model('Questions', questionSchema);
