const express = require('express');
const {  
    get_home,
    get_category_vised_products,
    get_product_detailed,
    demo
} = require('../../controller/user/home_controller');
const { isBlocked } = require('../../middleware/user/userAuthMiddleware');
const router = express.Router();



//get home 
router.get("/home",isBlocked,get_home) 

//get category vised view (for rendering category_view page)
router.get("/products-categorised-view",isBlocked,get_category_vised_products)

//get Single Product detailed view
router.get("/product-detailed/:id",isBlocked,get_product_detailed)
router.get("/product-detailed",isBlocked,demo)
 

 
module.exports = router;  