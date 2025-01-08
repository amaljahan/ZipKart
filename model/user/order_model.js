const mongoose = require('mongoose');


const orderSchema =  mongoose.Schema({
  TotalPrice: {
    type: Double,
    required: true
     },
  UserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref:"User",
    required: true 
},
  PaymentMethod: { 
    type: String, 
    required: true, 
    enum: [ 'Wallet', ' Online_pay', ' CashOnDelivery', ' ' ] 
  },
  AddressId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref:"Address",
    required: true 
  },
  // CouponId: { 
  //   type: Schema.Types.ObjectId 
  // },
  Products: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref:"Products",
    required: true },
});

module.exports = mongoose.model('Order', OrderSchema);



