const Product = require('../../model/adminModel/product_model')
const Category = require('../../model/adminModel/categoryModel')
const Review = require('../../model/reviews_model')
const mongoose = require('mongoose')

// =============================================//get home====================================
const get_home = async (req,res)=>{
    const products = await Product.find({isListed:true}).populate('category')
    try{        
        res.render('user/home',{products,session:req.session})
    }
    catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})
    }
}
// ------------------------------------------// get categorised product view---------------------------------------------------------------------------
 

const get_category_vised_products = async (req, res) => {
    const { sort = 'createdAt', search = '', page = 1, limit = 10, category } = req.query;
    console.log("category id:", category);

    try {
        let filter = { isListed: true };    
        if (search) {
            filter.name = { $regex: search, $options: "i" }; 
        }
        let ctgry;

        if (category) {
            try {
                filter.category = new mongoose.Types.ObjectId(category);
                ctgry = await Category.findById(category);
            } catch (error) {
                console.error("Invalid category ObjectId:", error);
                return res.status(400).json({ message: "Invalid category ID format" });
            }
        }
        console.log("filter applied:", filter);
        
        let sortObject = {};
        switch (sort) {
            case "popularity":
                sortObject = { popularity: -1 };
                break;
            case "price":
                sortObject = { price: 1 };
                break;
            case "-price":
                sortObject = { price: -1 };
                break;
            case "average-ratings":
                sortObject = { avgRating: -1 };
                break;
            case "featured":
                sortObject = { featured: -1 };
                break;
            case "new-arrivals":
                sortObject = { createdAt: -1 };
                break;
            case "aA-zZ":
                sortObject = { name: 1 };
                break;
            case "zZ-aA":
                sortObject = { name: -1 };
                break;
            default:
                sortObject = { createdAt: -1 };
                break;
        }

        const skip = (page - 1) * limit;

        const reviewsAggregation = Product.aggregate([
            {
                $match: filter  // Apply all filters at once
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $match: {
                    "categoryDetails": { $ne: [] }
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "product",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    avgRating: { $avg: "$reviews.star" },
                    reviewCount: { $size: "$reviews" }
                }
            },
            {
                $match: {
                    "categoryDetails.isListed": true
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $sort: sortObject
            },
            {
                $skip: skip
            },
            {
                $limit: Number(limit)
            },
            {
                $project: {
                    name: 1,
                    category: 1,
                    price: 1,
                    unit: 1,
                    description: 1,
                    stock: 1,
                    images: 1,
                    isListed: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    featured: 1,
                    popularity: 1,
                    reviews: 1,
                    avgRating: 1,
                    reviewCount: 1,
                    categoryName: "$categoryDetails.name"
                }
            }
        ]);

        const [categoriesWithCount, productsWithReviews, totalProducts] = await Promise.all([
            Product.aggregate([
                { $match: { isListed: true } },
                { $group: { _id: "$category", productCount: { $sum: 1 } } },
                {
                    $lookup: {
                        from: "categories",
                        localField: "_id",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                { $unwind: "$categoryDetails" },
                { $project: { name: "$categoryDetails.name", productCount: 1 } }
            ]),
            reviewsAggregation,
            Product.countDocuments(filter)
        ]);

        console.log("categories with count:", categoriesWithCount);
        console.log("products with reviews:", productsWithReviews);
        console.log("total products:", totalProducts);

        const totalPages = Math.ceil(totalProducts / limit);

        return res.render("user/category_view", {
            categories: categoriesWithCount,
            products: productsWithReviews,
            totalPages,
            currentPage: page,
            session: req.session,
            searchQuery: search,
            sort,
            ctgry: ctgry || ""
        });
    } catch (err) {
        console.error("Error in get_category_vised_products:", err);
        res.status(500).json({ message: "Server error" });
    }
};




// -----------------------------------------------//get single product detailed view----------------------------------------------------------------------


const get_product_detailed = async(req,res)=>{
    try{
        console.log('first page!')
        const productId = req.params.id;  
        const [
            product,
            products,
            reviews,
            categoiesWithCount
        ] = await Promise.all([
            Product.findById(productId).populate('category'),
            Product.find({isListed:true}).populate('category'),
            Review.find({ product: productId }).sort({ createdAt: -1 }),
            Product.aggregate([
                {
                    $match: { isListed: true },  // Filter out products that are listed
                },
                {
                    $group: {
                        _id: "$category", // Group by category ID
                        productCount: { $sum: 1 } // Count products in each category
                    }
                },
                {
                    $lookup: {
                        from: "categories", // collection name
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
            ])
        ]);
        
        

        
        if (!product) {
            return res.status(404).json('Product not found');
        }
        
        product.popularity = product.popularity + 1;
        product.save();

        // res.status(200).json({message : 'Data sended succefullyy.....!'})
        res.render('user/product_Detailed_view',{product,products,categories:categoiesWithCount,reviews,session:req.session})
    }
    catch(err){
        console.log('Error: ',err);
        res.status(500).json({ success: false, message:"server error"})
        
    }
}

const demo = async (req,res)=>{
    const id = "6763b04045afc7f6ae83709b"

    try{
        const productId = id;  
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
        res.render('user/product_Detailed_view',{product,products,categories:categoiesWithCount,reviews,session:req.session})


    }catch(e){
        console.log(e);
        
    }
}





module.exports={
    get_home,
    get_category_vised_products,
    get_product_detailed,
    demo

} 