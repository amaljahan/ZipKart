const mongoose = require('mongoose')



const addressesSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true, 
    },
    firstName: { 
        type: String, 
        required: true  
    },
    lastName: { 
        type: String,
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    pincode: { 
        type: Number, 
        required: true 
    },
    locality: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    cityDistrictTown: { 
        type: String,
        required: true 
    },
    state: { type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
    landmark: { 
        type: String, 
        required: true 
    },
    alternatePhone: { 
        type: String, 
    },
    addressType:{
        type: String, 
        required: true ,
        enum: [ 'home', 'work', 'other' ]
    }
    
},{ timestamps: true });

module.exports = mongoose.model("Address",addressesSchema)