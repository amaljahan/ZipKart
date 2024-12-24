const mongoose = require('mongoose');

const userSchema = mongoose.Schema({ 
    googleId: { 
        type: String,
        default: null 
    },
    thumbnail: {
         type: String, 
         default: null 
    },

    firstName:{
        type: String,
        required: [true, "please add the user name"],
       },
    lastName:{
        type: String,
        required: [true, "please add the name of the user"],
    },
    email:{
        type: String,
        required: [true, "Please add the user email address"],
        unique: [true,"Email address already taken"],
        lowercase: true,
    },
    password:{
        type:String,
        required: [false,"please add the user password"]
    },
    isBlocked:{
      type:Boolean,
      default:false
    }
},
{
    timestamp: true,
});

module.exports = mongoose.model("User",userSchema);