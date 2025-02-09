const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderId: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentMethod: { 
    type: String,     
    required: true, 
    enum: ['Wallet', 'Razorpay', 'COD'] 
  },
  address: {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    pincode: { type: Number, required: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    cityDistrictTown: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    landmark: { type: String, required: true },
    addressType: { type: String, required: true, enum: ['home', 'work', 'other'] },
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: 0 },

    status: { 
      type: String, 
      enum: [
        'Ordered', 
        'Cancelled',
        'Delivered',
      ], 
      default: 'Ordered' 
    },
    cancelReason: { type: String },// nilavil ith njn cheythittilla 
    returnReason: { type: String },//ithum 2 um cheyyanam
    returnStatus: { 
      type: String ,
      enum: [
        'Return Requested',
        'Return Rejected',
        'Return Approved',
        'Product Returned',
      ],
    },
  }],
  couponCode:{type:String},
  couponDiscount: { type: Number, default: 0 },
  subtotal:{type:Number,required:true},
  deliveryCharge: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    enum: [
      'Pending',
      'Order placed',
      // 'Confirmed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      ],
    default: 'Order placed',
  },
  paymentStatus :  {type : String },
  cancelAt: { type: String,default:""}

});

module.exports = mongoose.model('Order', orderSchema);
