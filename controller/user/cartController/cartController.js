const Carts = require('../../../model/user/cart_model') 
const Product = require('../../../model/adminModel/product_model'); 



const view_cart = async(req,res)=>{
    const userId = req.params.id;
    console.log(req.params);
    console.log(userId);
    
    
    try{
        let cart = await Carts.findOne({ userId }).populate('products.productId');
        if (!cart) {
            cart = new Carts({
                userId,
                products: [],
            });       
        }
        res.render('user/cart/cart', { cart:cart||null,session:req.session });
    }
    catch(err){
        console.error("Error: ", err);
        res.status(500).render('user/cart/cart', { message: "Server error", cart: null });
    }
}



const updateCart = async (req, res) => {
    const userId = req.params.id; 
    let { productId, count } = req.query; 
    count = Number(count)
    console.log(req.query);
    console.log(req.params);

    try {
      
        if (!productId || isNaN(count)) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }
        let [product, cart] = await Promise.all([
            Product.findById(productId),
            Carts.findOne({ userId }).populate('products.productId'),
        ]);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (count > 0 && product.stock < count) {
            return res.status(400).json({ success: false, message: "Not enough stock available" });
        }

        if (!cart) {

            cart = new Carts({
                userId,
                products: [],
            });
        }
        
         const productIndex = cart.products.findIndex((item) => {      
            return item.productId._id.toString() === productId;
        });
        
       
        console.log(productIndex);
        
        if (productIndex > -1) {
            const newQuantity = cart.products[productIndex].quantity + count;

            if (newQuantity <= 0) {
                cart.products.splice(productIndex, 1);
            } else if (newQuantity > 12) {
                return res.status(400).json({ success: false, message: "Maximum quantity exceeded" });
            } else {
                cart.products[productIndex].quantity = newQuantity;
            }
        } else {
            if (count > 0) {
                cart.products.push({ productId, quantity: count });
            } else {
                return res.status(400).json({ success: false, message: "Cannot decrease quantity of non-existent product" });
            }
        }



        console.log( "product stock : ",product.stock, " cart product quantity : ",cart.products[productIndex].quantity);
        
        if (productIndex >= 0 && product.stock < cart.products[productIndex].quantity) {
            return res.status(400).json({ success: false, message: "Out of stock" });
        }
        

        if(product.stock==0){//--------------------check this code is it necessary or not
            return res.status(400).json({ success: false, message: "Out of stock" });
        }
            
        if (product.stock < 0) {//for ensuring stock not going below zero
            product.stock = 0;
        }
        product.popularity = product.popularity + 4;

        await cart.save();
        await product.save();
        
        //  res.rdirect('user/cart/cart',{message: "Cart updated successfully",cart,session: req.session})
        return res.status(200).json({ success: true, message: "Cart updated successfully" ,url:`/zipkart/user/${userId}/cart`});
    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const delete_from_cart = async (req,res)=>{
    const userId = req.params.id;
    const productId = req.params.pid;    
    try{
        const result = await Carts.findOneAndUpdate(
            {userId},
            {$pull: {products: {productId}}},
            {new:true}
        );
        if(!result){
            return res.status(400).json({success:false, message:"Failed to remove the product from Cart."})
        }
        return res.status(200).json({success:true, message:"Product removed successfully."})
    }
    catch(err){
        console.log("Error deleting from cart:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}



module.exports = {
    view_cart,
    updateCart,
    delete_from_cart,
}