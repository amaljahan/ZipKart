const Coupons = require('../../model/adminModel/coupon_moddel')



const view_coupons = async(req, res)=>{
    try {
        const coupons = await Coupons.find().sort({createdAt:-1})
        res.render('admin/coupons',{coupons, session: req.session})
    } catch (error) {
        console.error('Error from view_coupons',error);
        res.status(500).json({message:"server error"});
    }
}

const add_coupon = async(req, res)=>{

    const { code, description, discountValue, expiryDate, maxDiscountLimit, minPurchaseAmount, usageLimit } = req.body
    console.log("at add coupon==========a>",req.body);

    try {

        const { code, description, discountType,discountValue, expiryDate, maxDiscountLimit, minPurchaseAmount, usageLimit } = req.body
        if (!code || !description || !discountType|| discountValue < 0 || minPurchaseAmount < 0 || new Date() > expiryDate || !usageLimit || !minPurchaseAmount || !maxDiscountLimit ) {
                return res.status(400).json({ success: false, message: 'Invalid input data' });
            }
        let codeUpper= code.toUpperCase() //for extra assurance.
        console.log("at add codeUpper==========>",codeUpper);

        const coupon = await Coupons.findOne({code:codeUpper})
        
        if(coupon){
            return res.status(404).json({ success: false, message: 'Coupon Code Name Already used' });
        }

        const newCoupon = new Coupons({
            code : codeUpper,
            description,
            discountType,
            discountValue,
            minPurchaseAmount,
            maxDiscountLimit,
            expiryDate,
            usageLimit,
        }) 
        await newCoupon.save()
        res.status(201).json({ success: true, message: 'New Coupon created successfully!' });   
  
    } catch (error) {
         console.error('Error from add_coupon',error);
        res.status(500).json({message:"server error"});
    }
}








const edit_coupon = async(req, res)=>{
    const { code, description, discountValue,discountType, expiryDate, maxDiscountLimit, minPurchaseAmount, usageLimit } = req.body
    const couponId = req.body.id
    try {
        if (!code || !description || !discountType || discountValue < 0 || minPurchaseAmount < 0 || new Date() > expiryDate || !usageLimit || !minPurchaseAmount || !maxDiscountLimit ) {
            return res.status(400).json({ success: false, message: 'Invalid input data' });
        }
        console.log("at edit coupon", req.body);

        let codeUpper= code.toUpperCase() //for extra assurance.

        const coupon = await Coupons.findById(couponId)

        if(!coupon){
            return res.status(404).json({ success: false, message: 'Coupon Code not found!, Please try to edit new one.' });
        }

        coupon.code = code;
        coupon.description = description;
        coupon.discountType = discountType;
        coupon.discountValue = discountValue;
        coupon.expiryDate = expiryDate;
        coupon.maxDiscountLimit = maxDiscountLimit;
        coupon.minPurchaseAmount = minPurchaseAmount;
        coupon.usageLimit = usageLimit;
        await coupon.save()
        return res.status(200).json({ success: true, message: 'Coupon Code updated successfully completed.' });
        
    } catch (error) {
         console.error("Error from add_coupon:",error);
        res.status(500).json({message:'Server Error'});
    }
}


const update_status_coupon = async(req, res)=>{
    const { isActive,couponId } = req.body
    try {
        const coupon = await Coupons.findById(couponId)
        if(!coupon){
            return res.status(404).json({ success: false, message: 'Coupon Code not found!, Please try try again after sometime...' });
        }
       
        
        coupon.isActive = isActive;
        coupon.save();
        return res.status(200).json({ success: true, message: 'Coupon Code status successfully changed.' });

    } catch (error) {
         console.error("Error from update_status_coupon:",error);
        res.status(500).json({message:'Server Error'});
    }
}


const delete_coupon = async(req, res)=>{
    const couponId = req.params.id
    try {
        const coupon = await Coupons.findByIdAndDelete(couponId)
        if(!coupon){
            return res.status(404).json({ success: false, message: 'Coupon Code not found!, Please try try again after sometime...' });
        }
        return res.status(200).json({ success: true, message: 'Coupon Code successfully removed.' });

    } catch (error) {
         console.error("Error from delete_coupon:",error);
        res.status(500).json({message:'Server Error'});
    }
}


module.exports = {
    view_coupons,
    add_coupon,
    edit_coupon,
    update_status_coupon,
    delete_coupon,
}