const Carts = require('../../../model/user/cart_model')
const Addresses = require('../../../model/user/accountDetailsModels/addressModel')
const Coupons = require('../../../model/adminModel/coupon_moddel')



const   view_checkout_page = async(req,res)=>{
    const userId = req.session.userId
    try{
        const [addresses, cart,coupons] = await Promise.all([
            Addresses.find({ userId }),
            Carts.findOne({ userId }).populate('products.productId'),
            Coupons.find({isActive:true}).sort({createdAt:-1})
        ]);
       
                if (!cart) {
                    return res.render('user/cart/cart', { message: "Unable to process, Cart not found", coupons : coupons || "", cart:cart || null,session: req.session });
                }

                console.log("++++===========c ouopon:",coupons);
                
        res.render("user/cart/checkout",{session:req.session, cart: cart || null, addresses, coupons: coupons || []})
    }
    catch(err){
        console.log("Error viewing from checkout page:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
} 



module.exports = {
    view_checkout_page,
    
}