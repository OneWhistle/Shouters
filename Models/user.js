var mongoose = require('mongoose');
var talks = ["For","Against"];

// If user creates tag by himslef(This will be for future use
var createdtagSchema = new mongoose.Schema({
 tagId:{type:mongoose.Schema.Types.ObjectId, ref:'tag'},
});

// In which tags user is chatted or participated
var participatedtagSchema = new mongoose.Schema({
 tagId:{type:mongoose.Schema.Types.ObjectId, ref:'tag'},
 talkabout:{type:String,required: true,enum:talks},
 tagName:{type: String,required: true }
});


var userSchema = new mongoose.Schema({
  name:{ type: String,required: true },
  phone:{ type: String, required: true,unique: true },
  email:{ type: String, unique: true },
  _password:{ type: String },
  accessToken: { type: String },
  gender:{ type: String },
  age:{ type: Number },
  profilePicture:{ type: String },
   _coordinates: {
    type: [Number],
    index: '2dsphere',
    default: [0, 0]
  },
  createdtag:[createdtagSchema],
  participatedtag:[participatedtagSchema]
},{collection: 'user'});
mongoose.model('user', userSchema);
