const mongoose = require("mongoose");

const productSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the category model
        ref:"Category", // This should be a string with the model name
        required: true
    },
    popularity: { 
        type: Number, 
        default: 0 
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be less than 0']
    },
    featured: { 
        type: Boolean, 
        default: false 
    },
    unit: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required:true,
        // minlength:10 
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be less than 0']
    },
    images: [
        {
        thumbnailUrl: { type: String, required: true }, // URL of the image after it’s cropped and resized for   the thumbnail
        showcaseUrl: { type: String, required: true }, // URL of the image after it’s cropped and resized for showcase image
        altText: { type: String, required: true } // Optional, can describe the image
        }
      ],
    isListed: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });


module.exports = mongoose.model('Products',productSchema)
