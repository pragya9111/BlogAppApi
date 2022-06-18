const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
    title:String,
    blog:String,
    username:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    date:{
        type:Date,
        default:Date.now()
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }]
})

module.exports = mongoose.model('blogs', blogSchema);