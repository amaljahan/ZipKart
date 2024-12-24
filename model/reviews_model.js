const mongoose = require('mongoose')
const Product = require('./adminModel/categoryModel')
const User = require('./user_model')

const reviewSchema = mongoose.Schema({
    description: {
        type: String,
        required:true,
        minlength:1
    },
    user: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref:"User", // This should be a string with the model name
            required: true
    } ,
    product: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
            ref:"Product", // This should be a string with the model name
            required: true
    } ,
    star:{
        type: Number,
        required:true,
        min: 1, // Minimum rating
        max: 5, // Maximum rating
    }
},{ timestamps: true });

module.exports = mongoose.model("Review",reviewSchema);