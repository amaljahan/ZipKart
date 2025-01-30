const get_category_vised_products = async (req, res) => {
    const { sort = 'createdAt', search = '', page = 1, limit = 10, category } = req.query;
    console.log(req.query);

    try {
        const categoryPromise = Product.aggregate([
            { $match: { isListed: true } },
            { $group: { _id: "$category", productCount: { $sum: 1 } } },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            { $unwind: "$categoryDetails" },
            { $project: { name: "$categoryDetails.name", productCount: 1 } },
        ]);


        let filter = { isListed: true };    
        if (search) {
            filter.name = { $regex: search, $options: "i" }; 
        }
        if (category) {
            filter.category = category; 
        }
        console.log("Filter:", filter);

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
                sortObject = { avgRating: -1 }; // For reviews
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
                $match: filter  // Apply the initial filter including isListed and category
            },
            {
                $lookup: {
                    from: "reviews", 
                    localField: "_id",
                    foreignField: "product",
                    as: "reviews",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $match: {
                    "categoryDetails.isListed": true
                }
            },
            {
                $addFields: {
                    avgRating: { $avg: "$reviews.star" },
                    reviewCount: { $size: "$reviews" }, 
                },
            },
            { 
                $unwind: "$categoryDetails"  // Move unwind after all lookups and matches
            },
            {
                $sort: sortObject,
            },
            {
                $skip: skip,
            },
            {
                $limit: Number(limit),
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
                    categoryName: "$categoryDetails.name",
                },
            },
        ]);
        
        
        

        // Count total products
        const totalProductsPromise = Product.countDocuments(filter);

        // Resolve all promises
        const [categoriesWithCount, productsWithReviews, totalProducts] = await Promise.all([
            categoryPromise,
            reviewsAggregation,
            totalProductsPromise,
        ]);
console.log("========================", productsWithReviews);

        const totalPages = Math.ceil(totalProducts / limit);

        // Render the page with products, categories, and reviews
        return res.render("user/category_view", {
            categories: categoriesWithCount,
            products: productsWithReviews,
            totalPages,
            currentPage: page,
            session: req.session,
            searchQuery: search,
            sort
        }); 
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
};