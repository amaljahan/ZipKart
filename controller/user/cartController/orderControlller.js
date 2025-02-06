const Order = require('../../../model/user/order_model')
const Addresses = require('../../../model/user/accountDetailsModels/addressModel')
const Product  = require('../../../model/adminModel/product_model')
const Cart  =  require('../../../model/user/cart_model')
const Wallet = require('../../../model/user/wallet_model')
const Razorpay= require('razorpay')
const crypto = require('crypto')

const KeyId=process.env.KEY_ID
const SecretKey= process.env.SECRET_KEY

const razorpayInstance = new Razorpay({
    key_id: KeyId, 
    key_secret: SecretKey 
});

function generateOrderId() {
    const timestamp = Date.now().toString(); // Current timestamp in milliseconds
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); // Random 4-digit number
    const prefix = "ZKORD"; // Custom prefix for the order

    return `${prefix}-${timestamp}-${randomPart}`;
}



const view_order_success_page = async(req,res)=>{
    try {
        const orderId = req.session.orderId
        console.log(orderId);
        
        if(orderId){
            res.render('user/cart/order/orderSuccessPage',{orderId})
        }
        else{
            res.status(400).redirect()
        }
    } catch (error) {
        console.log("Error viewing from Order page:", error);
        return res.status(500).json({ success: false, message: "Server error: "+ error });
    }
}




const create_order = async (req,res)=>{
    const {selectedAddressId, couponCode, paymentMethod, userId, deliveryCharge, totalPrice, subtotal} = req.body;
    console.log(req.body);
    
    try{
        if(!selectedAddressId || !paymentMethod || !userId  ){
            return res.status(400).json({status:false, message:"select all fields before submit."})
        }
        if( !totalPrice || !subtotal){
            return res.status(400).json({status:false, message:"Something went wrong please try again later."})
        }

        const [cart, address, wallet] = await Promise.all([
            Cart.findOne({userId}).populate("products.productId"),
            Addresses.findById(selectedAddressId),
            Wallet.findOne({ user: userId })
        ]) 

        console.log("=========== aDdres s: ", address);
        

        if(!cart || cart.products.length === 0){
            return res.status(404).json({ success: false, message: "Your cart is empty." });
        }
        if(!address){
            return res.status(404).json({ success: false, message: "Address not found!" });
        }
        if (!wallet) {
            return res.status(404).json({ success: false, message: "Wallet not found" });
        }

        if(paymentMethod === "Wallet" && wallet.balance < totalPrice){
            return res.status(400).json({success:false , message:"Insufficient wallet balance Check your Wallet" })
        }

        for(const item of cart.products){
            const product = await Product.findById(item.productId).populate();
            if(!product){
                return res.status(404).json({ success: false, message: "Product not found!" });
            }

            product.stock -= item.quantity;
            product.popularity += product.popularity + 5
            await product.save();
        }

        const products = cart.products.map(cartProduct=>{
            const product = cartProduct.productId;

            const price = product.price * cartProduct.quantity;
            
            return {
                productId: product._id,
                quantity: cartProduct.quantity,
                price,
                status: "Ordered",
            }
        })

        const order = new Order({
            orderId : generateOrderId(),
            userId,
            address:{
                name: `${address.firstName} ${address.lastName}`,
                phoneNumber: address.phoneNumber,
                pincode: address.pincode,
                locality: address.locality,
                address: address.address,
                cityDistrictTown: address.cityDistrictTown,
                state: address.state,
                country: address.country,
                landmark: address.landmark,
                addressType: address.addressType,
            },
            products,
            paymentMethod,
            subtotal: subtotal.toFixed(2),
            deliveryCharge: deliveryCharge.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
            status: paymentMethod === "razorpay"? "Pending" : "Order placed",
            paymentStatus: "Pending",
            orderDate: new Date()

        })
       await Promise.all([  
            order.save(),
            cart.deleteOne({userId})
        ])
        req.session.orderId = order.orderId

        
        if(paymentMethod === "Wallet"){
            wallet.balance -= totalPrice;
            wallet.transactions.push({
                amount: totalPrice,
                type: 'debit',
                description : `Payment for order , OrderId : ${order.orderId}`,
                date: new Date(),
            })
            await wallet.save();
        }

        if(paymentMethod === "Razorpay"){
            const options = {
                amount: totalPrice * 100,
                currency: 'INR',
                receipt: `order_rcpt_Id_r-pay-${Date.now()}`,
                payment_capture:1,
            }
            
            const razorpayOrder = await razorpayInstance.orders.create(options);        
            return res.status(201).json({
                success:true,
                KeyId,
                orderId:order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: options.amount,
                currency: options.currency,
                message: "Razorpay order created successfully. Proceed to payment."
            })                          
        }             
    
    return res.status(201).json({ success: true, message: "Order placed successfully", order });

    }
    catch(err){
        console.log("Error viewing from Order page:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


const verify_payment_of_order = async (req,res)=>{
    const orderId = req.params.orderId
    const{razorpay_payment_id, razorpay_order_id,razorpay_signature} = req.body
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const hmac = crypto.createHmac('sha256', SecretKey);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');
        if(generated_signature === razorpay_signature){
            order.status = 'Order placed';
            await order.save();
            return res.status(200).json({ success: true, message: 'Payment verification successfully completed!.'});

        }else {
            return res.status(400).json({ success: false, message: 'Payment verification failed!.' });
        }

        
    } catch (error) {
        console.log("Error viewing verify_payment_of_order :", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}




module.exports = {
    create_order,
    view_order_success_page,
    verify_payment_of_order,
}
