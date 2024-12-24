const express = require('express');
const { 
    view_products, 
    get_add_product, 
    add_Product, 
    get_edit_product, 
    edit_product, 
    edit_product_status, 
    delete_product 
} = require('../../controller/adminController/productController');
const router = express.Router(); 
const multer = require('multer');
const path = require('path');

// ==============================================================================================
// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join( 'public', 'css', 'admin', 'uploads')); // Store files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Set the filename for the uploaded file (add timestamp to make it unique)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));    },
  });
  
  // Initialize multer with storage settings
  const upload = multer({ storage: storage });
// ==============================================================================================


 
//add product 
router.post('/add-products', upload.array('images', 10), add_Product);  // Allow multiple images (10 in this case)

//view product
router.get("/view-products",view_products)

//render add product page
router.get("/view-add-product",get_add_product)

//render edit product page
router.get("/view-edit-product/:id",get_edit_product)

//edit product
router.post("/edit-product/:id", upload.array('images', 10),edit_product)

//edit product status as isListed / Listed
router.patch("/edit-product/:id/status", edit_product_status)


//delete product
router.delete("/delete-product/:id", delete_product)

module.exports = router