const Carts = require('../../../model/user/cart_model') 
const Product = require('../../../model/adminModel/product_model'); 
const Offers = require('../../../model/adminModel/offerModel'); 



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

// Controller

// const view_cart = async(req,res)=>{
//     const userId = req.params.id;
    
//     try {
//         // 1. Fetch cart with populated products
//         let cart = await Carts.findOne({ userId }).populate({
//             path: 'products.productId',
//             select: 'name price unit images categoryId'
//         });
        
//         console.log("Initial Cart Data:", JSON.stringify(cart, null, 2));

//         if (!cart) {
//             cart = new Carts({
//                 userId,
//                 products: [],
//             });       
//         }

//         // 2. Fetch active offers
//         const currentDate = new Date();
//         const activeOffers = await Offers.find({
//             isActive: true,
//             startDate: { $lte: currentDate },
//             endDate: { $gte: currentDate }
//         }).populate('applicableItems');

//         console.log("Active Offers:", JSON.stringify(activeOffers, null, 2));

//         // 3. Process cart products with offers
//         if (cart.products && cart.products.length > 0) {
//             cart.products = await Promise.all(cart.products.map(async (item) => {
//                 const product = item.productId;
                
//                 // Ensure product price exists and is a number
//                 const productPrice = Number(product.price) || 0;
//                 const quantity = Number(item.quantity) || 0;

//                 let bestDiscount = 0;
//                 let appliedOffer = null;

//                 // Check for valid activeOffers
//                 if (activeOffers && activeOffers.length > 0) {
//                     // Product-specific offers
//                     const productOffers = activeOffers.filter(offer => 
//                         offer.applicableType === 'product' && 
//                         offer.applicableItems.some(p => p._id.toString() === product._id.toString())
//                     );

//                     // Category-specific offers
//                     const categoryOffers = activeOffers.filter(offer => 
//                         offer.applicableType === 'category' && 
//                         product.categoryId && 
//                         offer.applicableItems.some(c => c._id.toString() === product.categoryId.toString())  // Ensure both are strings
//                     );
                    
// console.log("========categoryoffer:",categoryOffers);

// const applicableOffers = [...productOffers, ...categoryOffers];

// console.log("========applicableOffers:",applicableOffers);
//                     // Calculate best discount
//                     applicableOffers.forEach(offer => {
//                         let discountAmount = 0;
                        
//                         if (offer.discountType === 'percentage') {
//                             discountAmount = (productPrice * (Number(offer.discountValue) || 0)) / 100;
//                             if (offer.maxDiscountAmount) {
//                                 discountAmount = Math.min(discountAmount, Number(offer.maxDiscountAmount));
//                             }
//                         } else { // fixed discount
//                             discountAmount = Number(offer.discountValue) || 0;
//                         }

//                         if (discountAmount > bestDiscount) {
//                             bestDiscount = discountAmount;
//                             appliedOffer = offer;
//                         }
//                     });
//                 }

//                 // Calculate final prices
//                 const basePrice = productPrice * quantity;
//                 const totalDiscount = bestDiscount * quantity;
//                 const finalPrice = basePrice - totalDiscount;

//                 console.log(`Product ${product.name} calculations:`, {
//                     // basePrice,
//                     // bestDiscount,
//                     // totalDiscount,
//                     // finalPrice,
//                     appliedOffer: appliedOffer ? appliedOffer.name : 'None'
//                 });

//                 return {
//                     ...item.toObject(),
//                     appliedOffer,
//                     discountAmount: bestDiscount,
//                     basePrice,
//                     finalPrice
//                 };
//             }));
//         }

//         // Log final cart data
//         console.log("Final processed cart data:", JSON.stringify(cart, null, 2));

//         res.render('user/cart/cart', { 
//             cart: cart || null,
//             session: req.session 
//         });
//     }
//     catch(err){
//         console.error("Error in view_cart:", err);
//         res.status(500).render('user/cart/cart', { message: "Server error", cart: null });
//     }
// }
// const view_cart = async(req,res)=>{
//     const userId = req.params.id;
    
//     try {
//         let cart = await Carts.findOne({ userId }).populate({
//             path: 'products.productId',
//             select: 'name price unit images categoryId'
//         });
        
//         if (!cart) {
//             cart = new Carts({
//                 userId,
//                 products: [],
//             });       
//         }

//         // Fetch all active offers
//         const currentDate = new Date();
//         const activeOffers = await Offers.find({
//             isActive: true,
//             startDate: { $lte: currentDate },
//             endDate: { $gte: currentDate }
//         }).populate('applicableItems');

//         // Calculate prices with offers for each product
//         if (cart.products) {
//             cart.products = await Promise.all(cart.products.map(async (item) => {
//                 const product = item.productId;
//                 let bestDiscount = 0;
//                 let appliedOffer = null;

//                 // Check product-specific offers
//                 const productOffers = activeOffers.filter(offer => 
//                     offer.applicableType === 'product' && 
//                     offer.applicableItems.some(p => p._id.equals(product._id))
//                 );

//                 // Check category-specific offers
//                 const categoryOffers = activeOffers.filter(offer => 
//                     offer.applicableType === 'category' && 
//                     offer.applicableItems.some(c => c._id.equals(product.categoryId))
//                 );

//                 // Combine all applicable offers
//                 const applicableOffers = [...productOffers, ...categoryOffers];

//                 // Find best discount
//                 applicableOffers.forEach(offer => {
//                     let discountAmount;
//                     if (offer.discountType === 'percentage') {
//                         discountAmount = (product.price * offer.discountValue) / 100;
//                         if (offer.maxDiscountAmount) {
//                             discountAmount = Math.min(discountAmount, offer.maxDiscountAmount);
//                         }
//                     } else { // fixed discount
//                         discountAmount = offer.discountValue;
//                     }

//                     if (discountAmount > bestDiscount) {
//                         bestDiscount = discountAmount;
//                         appliedOffer = offer;
//                     }
//                 });

//                 return {
//                     ...item.toObject(),
//                     appliedOffer,
//                     discountAmount: bestDiscount
//                 };
//             }));
//         }

//         res.render('user/cart/cart', { 
//             cart: cart || null,
//             session: req.session 
//         });
//     }
//     catch(err){
//         console.error("Error: ", err);
//         res.status(500).render('user/cart/cart', { message: "Server error", cart: null });
//     }
// }


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

            cart = new Carts
                userId,({
                products: [],
            });
        }
        
         const productIndex = cart.products.findIndex((item) => {      
            return item.productId._id.toString() === productId;
        });
        
       
        console.log(productIndex);
        
        if (productIndex > -1) {
            const newQuantity = cart.products[productIndex].quantity + count;
console.log("new Quantity : ", newQuantity);

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
        
        
        if (productIndex >= 0 && product.stock < cart.products[productIndex]?.quantity) {
            return res.status(400).json({ success: false, message: "Out of stock" });
        }
        

        if(product.stock==0){//--------------------check this code is it necessary or not
            return res.status(400).json({ success: false, message: "Out of stock" });
        }
            
        if (product.stock < 0) {//for ensuring stock not going below zero
            product.stock = 0;
        }
        product.popularity = product.popularity + 4;
        
        await Promise.all([
            cart.save(), 
            product.save()
        ]);
        
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