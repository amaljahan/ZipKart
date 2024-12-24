const Product = require('../../model/adminModel/product_model')
const Category = require('../../model/adminModel/categoryModel')
const Review = require('../../model/reviews_model')

// =============================================//get home====================================
const get_home = async (req,res)=>{
    const products = await Product.find().populate('category')
    try{
        console.log('at home session : ',req.session.user);
        
        res.render('user/home',{products,session:req.session})
    }
    catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})
    }
}
// ------------------------------------------// get categorised product view---------------------------------------------------------------------------
 
const get_category_vised_products = async(req,res)=>{
    try{
        // const categories = await Category.find()
        const categoiesWithCount = await Product.aggregate([
            {
                $group: {
                    _id: "$category", // Group by category ID
                    productCount: { $sum: 1 } // Count products in each category
                }
            },
            {
                $lookup: {
                    from: "categories", //collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails" // Flatten the categoryDetails into array
            },
            {
                $project: {
                    name: "$categoryDetails.name", 
                    productCount: 1
                }
            }
        ]);


        const {category} = req.query
        
    

        let products;
        if (category) {
            products = await Product.find({ category: category }).populate('category');
        } else {
            products = await Product.find().populate('category');
        }

        res.render('user/category_view',{categories:categoiesWithCount,products,session:req.session})
    }
    catch(err){
        console.log('Error: ',err);
        res.status(500).json({message:"server error"})
        
    }
}

// -----------------------------------------------//get single product detailed view----------------------------------------------------------------------


const get_product_detailed = async(req,res)=>{
    try{
        const productId = req.params.id;  
        const product = await Product.findById(productId).populate('category'); 
        const products = await Product.find().populate('category'); 
        const categories = await Category.find()
        const reviews = await Review.find({product:productId}).sort({createdAt:-1});
        const categoiesWithCount = await Product.aggregate([
            {
                $group: {
                    _id: "$category", // Group by category ID
                    productCount: { $sum: 1 } // Count products in each category
                }
            },
            {
                $lookup: {
                    from: "categories", //collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails" // Flatten the categoryDetails into array
            },
            {
                $project: {
                    name: "$categoryDetails.name", 
                    productCount: 1
                }
            }
        ]);



        if (!product) {
            return res.status(404).json('Product not found');
        }
        res.render('user/product_Detailed_view',{product,products,categories:categoiesWithCount,reviews,session:req.session})
    }
    catch(err){
        console.log('Error: ',err);
        res.status(500).json({ success: false, message:"server error"})
        
    }
}





module.exports={
    get_home,
    get_category_vised_products,
    get_product_detailed,

} 