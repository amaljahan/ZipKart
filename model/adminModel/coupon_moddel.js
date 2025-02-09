const mongoose = require('mongoose');
const User = require('../user_model');
const Order = require('../user/order_model');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,  
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], 
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 1
    },
    minPurchaseAmount: {
        type: Number,
        default: 0 // The Minimum amount required to use the coupon
    },
    maxDiscountLimit: {
        type: Number,
        default: null //this Maximum discount allowed only for percentage type
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 1 // Number of times a coupon can be used per user
    },
    usersUsed: [
        {
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            usedCount: { type: Number, default: 0 }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    refundTracking: [  // for Tracking returns and refunded discount
        {
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            refundedAmount: { type: Number, default: 0 }, // Discount refunded due to return add to this section
            returnDate: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
