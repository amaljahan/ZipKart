

const Review = require('../../model/reviews_model')
const Product = require('../../model/adminModel/product_model')


const review_rating = async(req,res)=>{
    if(req.session.isBlocked){
        return res.redirect('/zipkart/user/login')
    }

    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Please log in to submit a review."
        });
    }
    const {review,productId,rating} = req.body;
    console.log("body ; ",req.body);
    // console.log("body with ; ",description,productId,star);
    
    try{

        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({ success:false, message: "Product not found." });
            // handle this error message while the returning message pass as a message of nedd both review and star reedback ok
        }
        const newreview = new Review({
            user:req.session.userId,//ithan ivide kodukkendath
            description:review,
            product: productId,
            star:rating 
        });
 
        await newreview.save();
        return res.status(201).send({ success:true, message: "Review submitted successfully.", review });

    }
    catch(err){
        console.log("Error: ",err);
        res.status(500).json({ success:false, message: "Error submitting review.", err });
    }
    
}

module.exports = {
    review_rating,
};
