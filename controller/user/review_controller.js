

const Review = require('../../model/reviews_model')
const Product = require('../../model/adminModel/product_model')


const mongoose = require('mongoose');

const review_rating = async (req, res) => {
    if (req.session.isBlocked) {
        return res.redirect('/zipkart/user/login');
    }

    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Please log in to submit a review."
        });
    }

    const { review, productId, rating } = req.body;
    console.log("body:", req.body);

    try {
        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID." });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        // Check if user has already reviewed the product
        const existingReview = await Review.findOne({ user: req.session.user._id, product: productId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this product." });
        }

        // Create new review
        const newReview = new Review({
            user: req.session.user._id,
            description: review,
            product: productId,
            star: rating
        });

        await newReview.save();
        return res.status(201).json({ success: true, message: "Review submitted successfully." });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};


module.exports = {
    review_rating,
};
