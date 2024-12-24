const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({ 
   
    email:{
        type: String,
        requrired: [true, "Please add the user email address"],
        // unique: [true,"Email address already taken"],
        lowercase: true,
    },
    otp:{
        type:String
    },
    otpExpiresAt:{
        type:Date
    }
});

module.exports = mongoose.model("Otp",otpSchema);