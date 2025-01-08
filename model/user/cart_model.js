const mongoose = require('mongoose');


const CartSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required: true, 
        unique: true 
    },
    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref:"Products",
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true,
            min: 1,
            max: 12, 
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model("Cart",CartSchema)

