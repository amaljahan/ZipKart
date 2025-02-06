const Wishlist = require('../../../model/user/wishlist_model')


const get_wishlist = async(req,res)=>{
    const userId = req.params.id
    try {
        if(!userId){
            return res.status(400).json({success:false, message: "Please login before doing this action"})
        }
        const wishlist = await Wishlist.findOne({user:userId}).populate("products.product")   
        wishlist.products.sort((a, b) => new Date(b.date) - new Date(a.date)); 
        
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


module.exports = {
    get_wishlist,
    add_to_wishlist

}