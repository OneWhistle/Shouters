var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
 tagName:{type: String,required: true},
 tagPicture:{type: String},
 createdAtISO:{
    type: Date,
    default: Date.now,
    required: true
  },
  duration:{type: Number},
  radius:{type: Number}
},{collection:'tag'});

mongoose.model('tag', tagSchema);

