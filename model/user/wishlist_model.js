const mongoose = require('mongoose');
const User = require('../user_model');
const Products = require('../adminModel/product_model');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : User,
        required: true,
    },
    products: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: Products,
                required: true,
            },
            date: { type: Date, default: Date.now }
        }
    ]
})

module.exports = mongoose.model('Wishlist',wishlistSchema)