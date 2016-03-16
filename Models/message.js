var mongoose = require('mongoose');

var talks = ["For","Against"];

var messageSchema = new mongoose.Schema({
 tagId:{type: mongoose.Schema.Types.ObjectId,ref:'tag'},
 userId:{type: mongoose.Schema.Types.ObjectId,ref:'user'},
 messsageText:{type : String},
 deliveredFlag:{type : Boolean},
 messageCoordinates:{type: mongoose.Schema.Types._coordinates,ref:'user'},
 createdAtISO:{
    type: Date,
    default: Date.now,
    required: true
  },
 talkabout:{type:String,required: true,enum:talks}
 },{collection:'message'});

mongoose.model('message', messageSchema);
