var mongoose = require('mongoose');

var tag = new mongoose.Schema({
 tagName:{type: String,required: true },
 tagPicture:{type: String}
},{collection:'tag'});

mongoose.model('tag', userSchema);

