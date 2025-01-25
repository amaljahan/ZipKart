const Order = require('../../../model/user/order_model')
const Addresses = require('../../../model/user/accountDetailsModels/addressModel')
const Product  = require('../../../model/adminModel/product_model')
const Cart  =  require('../../../model/user/cart_model')


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

        const [cart, address] = await Promise.all([
            Cart.findOne({userId}).populate("products.productId"),
            Addresses.findOne({userId})
        ]) 

        if(!cart || cart.products.length === 0){
            return res.json({ success: false, message: "Your cart is empty." });
        }
        if(!address){
            return res.json({ success: false, message: "Address not found!" });
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
                status: "Pending",
            }
        })
        console.log("====================================================",`${address.firstName} ${address.lastName} `);


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
            status: "Order placed",
            paymentStatus: "Pending",
            orderDate: new Date()

        })
       await Promise.all([  
            order.save(),
            cart.deleteOne({userId})
        ])
        req.session.orderId = order.orderId

        return res.status(201).json({success:true})                                                                         
    }
    catch(err){
        console.log("Error viewing from Order page:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = {
    create_order,
    view_order_success_page,
}
