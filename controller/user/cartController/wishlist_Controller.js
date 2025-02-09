const Wishlist = require('../../../model/user/wishlist_model')
const Products = require('../../../model/adminModel/product_model')
const Cart = require('../../../model/user/cart_model')


const get_wishlist = async(req,res)=>{
    const userId = req.params.id
    try {
        if(!userId){
            return res.status(400).json({success:false, message: "Please login before doing this action"})
        }
        const wishlist = await Wishlist.findOne({user:userId}).populate("products.product")   
        if(wishlist){
            wishlist.products.sort((a, b) => new Date(b.date) - new Date(a.date)); 
        }        
        res.render('user/accountDetails/wishlist',{session : req.session , wishlist: wishlist || []})
        
    } catch (error) {
        console.log("Error from get_wishlist: ",error);  
        res.status(500).json({message:"server error "})
    }
}


const add_to_wishlist = async(req,res)=>{
    const userId = req.params.id
    const productId = req.body.productId
    try {
        if(!userId || !productId){
            return res.status(400).json({success:false})
        }
        const wishlist = await Wishlist.findOne({user:userId}) 

        if(!wishlist){
            const newWishlist = new Wishlist({
                user: userId,
                products: [{ product: productId }]
            })
            await newWishlist.save();
            return res.status(200).json({success: true, message: "Product added to wishlist successfully"});
        }
        const productExist  = wishlist.products.some(
            item=>item.product.toString() === productId
        )
        if (productExist) {
            return res.status(400).json({success: false, message: "Product already exists in the Wishlist!"});
        }

        // Add product and save
        wishlist.products.push({ product: productId });
        await wishlist.save();

        return res.status(200).json({success: true, message: "Product added to wishlist successfully"});

    } catch (error) {
        console.log("Error from get_wishlist: ",error); 
        res.status(500).json({message:"server error "})
    }
}


const wishlist_add_to_cart = async (req, res) => {
    const userId = req.params.id; 
    let { productId, count } = req.query; 
    count = Number(count)
    console.log(req.query);
    console.log("==============prdouctid:",productId);
    


    try {
        
        if (!productId || isNaN(count)) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }
        let [product, cart] = await Promise.all([
            Products.findById(productId),
            Cart.findOne({ userId }).populate('products.productId'),
        ]);
        console.log("================product:",product);
        

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (count > 0 && product.stock < count) {
            return res.status(400).json({ success: false, message: "Not enough stock available" });
        }
        if (!cart) {

            cart = new Cart({
                userId,
                products: [],
            });
        }

        
         const productIndex = cart.products.findIndex((item) => {      
            return item.productId._id.toString() === productId;
        });

        if(productIndex>= 0){
            return res.status(400).json({ success: false, message: "Product Already exist in the cart!." });

        }
        cart.products.push({ productId, quantity: count });
        product.popularity = product.popularity + 4;

        
        await Promise.all([
            cart.save(), 
            product.save()
        ]);

        return res.status(201).json({ success: true, message: "Product added successfully." ,url:`/zipkart/user/${userId}/cart`});
    } catch (error) {
        console.error("Error wishlist_add_to_cart :", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const remove_from_wishlist = async (req,res)=>{
    const userId = req.params.id;
    const productId = req.params.pid;    
    try{
        const wishlist = await Wishlist.findOne({user:userId}).populate("products.product")

        if(!wishlist){
            return res.status(400).json({success:false, message:"Failed to remove the product from Wishlist!."})
        }

        const productIndex = wishlist.products.findIndex(item=>{
            return item.product._id.toString() === productId
        })
        console.log(productIndex);
        if(productIndex>-1){
            wishlist.products.splice(productIndex,1)
        } else {
            return res.status(400).json({ success: false, message: "Cannot remove product product. Something went wrong please try again!." });
        }
        await wishlist.save();

        return res.status(200).json({success:true, message:"Product removed successfully."})
    }
    catch(error){
        console.log("Error remove_from_wishlist:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}






module.exports = {
    get_wishlist,
    add_to_wishlist,
    wishlist_add_to_cart,
    remove_from_wishlist

}