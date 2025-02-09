const Offers = require('../../model/adminModel/offerModel')
const Products = require('../../model/adminModel/product_model')
const Categories = require('../../model/adminModel/categoryModel')



const view_offers = async(req, res)=>{
    try {
        const [offers, products, categories] = await Promise.all([
            Offers.find().populate("applicableItems").sort({ createdAt: -1 }),
            Products.find().sort({ createdAt: -1 }),
            Categories.find().sort({ createdAt: -1 })
        ]);
        console.log("====================ofers:",offers);
        
        
        res.    render('admin/offers',{offers, session: req.session, products, categories})

    } catch (error) {
        console.error('Error from view_offers',error);
        res.status(500).json({message:"server error"});
    }
}

const view_add_offer = async(req, res)=>{
    try {
        const [offers, products, categories] = await Promise.all([
            Offers.find().sort({ createdAt: -1 }),
            Products.find().sort({ createdAt: -1 }),
            Categories.find().sort({ createdAt: -1 })
        ]);
        
        
        res.render('admin/addOffer',{offers, session: req.session, products, categories})

    } catch (error) {
        console.error('Error from view_offers',error);
        res.status(500).json({message:"server error"});
    }
}


const add_offer = async (req, res) => {
    try {
        const {
            offerName, description, discountType, discountValue,
            applicableType, applicableItems, maxDiscountAmount,
            startDate, endDate
        } = req.body;

        console.log("at add offer==========a>", req.body);

        if (!offerName || typeof offerName !== 'string') {
            return res.status(400).json({ success: false, message: 'Offer name is required and must be a string.' });
        }
        if (!discountType || !["percentage", "fixed"].includes(discountType)) {
            return res.status(400).json({ success: false, message: 'Invalid discount type. Must be "percentage" or "fixed".' });
        }
        if (!applicableType || !["category", "product"].includes(applicableType)) {
            return res.status(400).json({ success: false, message: 'Invalid applicable type. Must be "category" or "product".' });
        }
        if (!applicableItems) {
            return res.status(400).json({ success: false, message: `please select any ${applicableType}!` });
        }

        // Ensure the items exist in the correct collection (Category or Product)
        let validItems;
        if (applicableType === "category") {
            validItems = await Categories.find({ _id: { $in: applicableItems } });
        } else {
            validItems = await Products.find({ _id: { $in: applicableItems } });
        }

        if (validItems.length !== applicableItems.length) {
            return res.status(400).json({ success: false, message: 'Some applicable items are invalid.' });
        }

        
        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).json({ success: false, message: "End date must be after start date." });
        }

        const name = offerName.toUpperCase();
        const existingOffer = await Offers.findOne({ name });
        if (existingOffer) {
            return res.status(400).json({ success: false, message: "This offer name already exists! Try a new one." });
        }

        // Create and save the offer
        const newOffer = new Offers({
            name,
            description,
            discountType,
            discountValue,
            applicableType,
            applicableItems,
            maxDiscountAmount,
            startDate,
            endDate
        });

        await newOffer.save();
        res.status(201).json({ success: true, message: "Offer created successfully!" });

    } catch (error) {
        console.error('Error from add_offer:', error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};






const view_edit_offer = async(req, res)=>{
    try {
        const [offers, products, categories] = await Promise.all([
            Offers.find().sort({ createdAt: -1 }),
            Products.find().sort({ createdAt: -1 }),
            Categories.find().sort({ createdAt: -1 })
        ]);
        
        
        res.render('admin/addOffer',{offers, session: req.session, products, categories})

    } catch (error) {
        console.error('Error from view_offers',error);
        res.status(500).json({message:"server error"});
    }
}

const edit_offer = async (req, res) => {
    const {
        offerName, description, discountType, discountValue,
        applicableType, applicableItems, maxDiscountAmount,
        startDate, endDate
    } = req.body;

    const offerId = req.params.id;

    try {
        if (!offerName || typeof offerName !== 'string') {
            return res.status(400).json({ success: false, message: 'Offer name is required and must be a string.' });
        }
        if (!discountType || !["percentage", "fixed"].includes(discountType)) {
            return res.status(400).json({ success: false, message: 'Invalid discount type. Must be "percentage" or "fixed".' });
        }
        if (!applicableType || !["category", "product"].includes(applicableType)) {
            return res.status(400).json({ success: false, message: 'Invalid applicable type. Must be "category" or "product".' });
        }
        if (!applicableItems || applicableItems.length === 0) {
            return res.status(400).json({ success: false, message: `Please select at least one ${applicableType}!` });
        }

        const applicableItemsArray = Array.isArray(applicableItems) ? applicableItems : [applicableItems];

        let validItems;
        if (applicableType === "category") {
            validItems = await Categories.find({ _id: { $in: applicableItemsArray } });
        } else {
            validItems = await Products.find({ _id: { $in: applicableItemsArray } });
        }

        if (validItems.length !== applicableItemsArray.length) {
            return res.status(400).json({ success: false, message: 'Some applicable items are invalid.' });
        }

        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).json({ success: false, message: "End date must be after start date." });
        }

        console.log("At edit offer", req.body);
        const name = offerName.toUpperCase();

        const offer = await Offers.findById(offerId);
        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found! Try again.' });
        }

        if (offer.name !== name) {
            const existingOffer = await Offers.findOne({ name });
            if (existingOffer) {
                return res.status(400).json({ success: false, message: "This offer name already exists! Try a new one." });
            }
        }

        offer.name = name;
        offer.description = description;
        offer.discountType = discountType;
        offer.discountValue = discountValue;
        offer.applicableType = applicableType;
        offer.applicableItems = applicableItemsArray; 
        offer.maxDiscountAmount = maxDiscountAmount;
        offer.startDate = startDate;
        offer.endDate = endDate;

        await offer.save();

        return res.status(200).json({ success: true, message: 'Offer updated successfully.' });

    } catch (error) {
        console.error("Error from edit_offer:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};



const update_status_offer = async(req, res)=>{
    const { isActive,offerId } = req.body
    try {
        const offer = await Offers.findById(offerId)
        if(!offer){
            return res.status(404).json({ success: false, message: 'Offer Code not found!, Please try try again after sometime...' });
        }
       
        
        offer.isActive = isActive;
        offer.save();
        return res.status(200).json({ success: true, message: 'Offer Code status successfully changed.' });

    } catch (error) {
         console.error("Error from update_status_offer:",error);
        res.status(500).json({message:'Server Error'});
    }
}


const delete_offer = async(req, res)=>{
    const offerId = req.params.id
    try {
        const offer = await Offers.findByIdAndDelete(offerId)
        if(!offer){
            return res.status(404).json({ success: false, message: 'Offer Code not found!, Please try try again after sometime...' });
        }
        return res.status(200).json({ success: true, message: 'Offer Code successfully removed.' });

    } catch (error) {
         console.error("Error from delete_offer:",error);
        res.status(500).json({message:'Server Error'});
    }
}


module.exports = {
    view_offers,
    add_offer,
    edit_offer,
    update_status_offer,
    delete_offer,
    view_add_offer,
    view_edit_offer
}