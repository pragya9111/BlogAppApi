const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blogapidb');
const plm = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  name:String,
  username:String,
  contact:Number,
  gender:String,
  email:String,
  password:String,
  blog:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'blogs'
  }],
  savedblog:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'blogs'
  }]
})

userSchema.plugin(plm);
module.exports=mongoose.model('users', userSchema);