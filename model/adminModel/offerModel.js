const mongoose = require("mongoose");
const Product = require("./product_model");
const Category = require("./categoryModel");


const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    }, 
    applicableType: {
        type: String,
        enum: ['category', 'product'], 
        required: true,
    },
    applicableItems: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: function () {
                    return this.applicableType === 'category' ? Category : Product;
                }
            }
        ],
        required: true,
    },
    maxDiscountAmount: {
        type: Number,
        default: null,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true 
    },
    
} ,{
    timestamps: true, 
});

module.exports = mongoose.model("Offer", offerSchema);
