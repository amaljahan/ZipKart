const Carts = require('../../../model/user/cart_model')
const Addresses = require('../../../model/user/accountDetailsModels/addressModel')



const   view_checkout_page = async(req,res)=>{
    const userId = req.session.userId
    try{
        const [addresses, cart] = await Promise.all([
            Addresses.find({ userId }),
            Carts.findOne({ userId }).populate('products.productId')
        ]);
        
        // const addresses = await Addresses.find({userId})
        // const cart = await Carts.findOne({ userId }).populate('products.productId');
                if (!cart) {
                    return res.status(404).render('user/cart/cart', { message: "Unable to process, Cart not found", cart: null,session: req.session });
                }
        res.render("user/cart/checkout",{session:req.session, cart: cart || null, addresses})
    }
    catch(err){
        console.log("Error viewing from checkout page:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
} 



module.exports = {
    view_checkout_page,
    
}