const get_category_vised_products = async (req, res) => {
    const { sort = 'createdAt', search = '', page = 1, limit = 10, category } = req.query;

    try {
        // Aggregate categories with product count
        const categoriesWithCount = await Product.aggregate([
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
        ]);

        // Prepare the filter and sort logic
        let filter = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        let sortObject = {};
        switch (sort) {
            case 'popularity':
                sortObject = { popularity: -1 }; // Assuming you have a popularity field
                break;
            case 'price-low-high':
                sortObject = { price: 1 }; // Price from low to high
                break;
            case 'price-high-low':
                sortObject = { price: -1 }; // Price from high to low
                break;
            case 'average-ratings':
                sortObject = { ratings: -1 }; // Average ratings (assumes a ratings field)
                break;
            case 'featured':
                sortObject = { featured: -1 }; // Featured products
                break;
            case 'new-arrivals':
                sortObject = { createdAt: -1 }; // Newest products first
                break;
            case 'a-z':
                sortObject = { name: 1 }; // A to Z
                break;
            case 'z-a':
                sortObject = { name: -1 }; // Z to A
                break;
            default:
                sortObject = { createdAt: -1 }; // Default to "new arrivals" if no sort is provided
                break;
        }

        // Pagination logic
        const skip = (page - 1) * limit;
        
        // Fetch products based on category, filter, sort, and pagination
        let products;
        if (category) {
            products = await Product.find({ category: category, ...filter })
                                    .sort(sortObject)
                                    .skip(skip)
                                    .limit(Number(limit))
                                    .populate('category');
        } else {
            products = await Product.find(filter)
                                    .sort(sortObject)
                                    .skip(skip)
                                    .limit(Number(limit))
                                    .populate('category');
        }

        // Count the total products for pagination
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        // Render the page with products and categories
        res.render('user/category_view', {
            categories: categoriesWithCount,
            products,
            totalPages,
            currentPage: page,
            session: req.session
        });

    } catch (err) {
        console.log('Error: ', err);
        res.status(500).json({ message: "Server error" });
    }
};
