const Product = require('../../model/adminModel/product_model')
const Category = require('../../model/adminModel/categoryModel')
const path = require('path');
const sharp = require('sharp');  // Library for resizing images
const fs = require('fs'); // For deleting temporary files after resizing

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const convertToWebPath = (filePath) => filePath.replace(/\\/g, '/');


//get products 
const view_products = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const [products, totalProducts] = await Promise.all([
        Product.find().populate('category', 'name') // Populate only the 'name' field of the category
                                            .sort({ createdAt: -1 }) // latest first
                                            .skip(skip)
                                            .limit(limit),
        Product.countDocuments(),
      ])
      const totalPages = Math.ceil(totalProducts / limit);


                                            
      res.render("admin/products", {
            products,
            message:null,
            skip,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            limit
       });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  };
  





//get add product 
const get_add_product =  async (req, res) => {
    try {
        const categories = await Category.find();  
        res.render('admin/add_product', { categories });  
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching categories');
    }
  }

//get edit product 
const get_edit_product =  async (req, res) => {
  const productId = req.params.id
  try {
      const [product, categories] = await Promise.all([
        Product.findById(productId).populate('category', 'name'),
        Category.find()
      ]);

        res.render('admin/edit_product', { product,categories });  
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching categories');
    }
  }



// -----------------------------------------  edit product  --------------------------------------------------------------
const edit_product = async (req, res) => { 
  try { 
    
    const productId = req.params.id; 
    let { name, category, price, stock, description, unit, existingImages } = req.body;
    name = name.toUpperCase();
    const totalImageLength = req.files.length + existingImages.length

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if(product.name !== name){
       const isExist = await Product.findOne({name})
      if(isExist.name !== product.name){
        return res.status(409).json({success:false, message:"Product name already exist!, Please try with a different name."})
      }
    }

    // Update product details
    product.name = name.trim();
    product.category = category;
    product.price = parseFloat(price);
    product.stock = parseInt(stock);
    product.description = description.trim();
    product.unit = unit;


     let imageUrls = [];

     // Check if existingImages is defined and is an array
     if (Array.isArray(existingImages)) {
       imageUrls = existingImages.map(image => ({
         thumbnailUrl: image.replace(/\\/g, "/"), // Normalize the path to forward slashes
         showcaseUrl: image.replace(/\\/g, "/"),  // Assuming showcaseUrl is same for existing images
         altText: "Product Image", // Default altText if not provided
       }));
     }

     if (totalImageLength < 3) {
      return res.status(400).json({
        message: 'At least 3 valid image files are required.',
      });
    }

    // Handle newly uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Define paths for resized images
        const thumbnailPath = path.join("public",
                                        "css",
                                        "admin",
                                        "uploads",
                                        `thumb-${Date.now()}${path.extname(file.originalname)}`
        );
        const showcasePath = path.join("public",
                                        "css",
                                        "admin",
                                        "uploads",
                                        `showcase-${Date.now()}${path.extname(file.originalname)}`
        );
        
        // Create thumbnail for admin
        await sharp(file.path)
        .resize(150, 150)
        .toFile(thumbnailPath);
        
        // Create showcase image for product page
        await sharp(file.path)
        .resize(500, 500)
        .toFile(showcasePath);
        
        const thumbnailUrl = convertToWebPath(path.join('/css/admin/uploads', path.basename(thumbnailPath)));
        const showcaseUrl = convertToWebPath(path.join('/css/admin/uploads', path.basename(showcasePath)));

        // Add to image URLs array
        imageUrls.push({
          thumbnailUrl,
          showcaseUrl,
          altText: "Product Image",
        });

        await delay(100); // Add a 100ms delay
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      }
    }

    product.images = imageUrls;

    await product.save();

    res.redirect("/zipkart/admin/products/view-products");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error editing product", error: err.message });
  }
};



// ============================================= Create Product =============================================================

const add_Product = async (req, res) => {

  try {
    let { name, category, price, stock, description, unit } = req.body;
    name = name.toUpperCase();

    const imageUrls = [];  // This will hold the URLs of resized images

    const isExist = await Product.findOne({name})
    if(isExist){
      return res.status(409).json({success:false, message:"Product name already exist!, Please try with a different name."})
    }

    // Loop through the uploaded images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // const timestamp = Date.now();
        // Define the file paths for the resized images
        const thumbnailPath = path.join('public',
                                        'css', 
                                        'admin', 
                                        'uploads', 
                                        `thumb-images-${Date.now()}${path.extname(file.originalname)}`);
        const showcasePath = path.join('public', 
                                        'css', 
                                        'admin', 
                                        'uploads', 
                                        `showcase-images-${Date.now()}${path.extname(file.originalname)}`);


          //validating file typess
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
          if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ message: `Invalid file type: ${file.originalname}` });
          }

        await sharp(file.path)
          .resize(150, 150)  
          .toFile(thumbnailPath);  // Save thumbnail

        // Resize for Product Side (Showcase)
        await sharp(file.path)
          .resize(500, 500)  // Resize to 500x500 for product side
          .toFile(showcasePath);  // Save showcase image

        const thumbnailUrl = convertToWebPath(path.join('/css/admin/uploads', path.basename(thumbnailPath)));
        const showcaseUrl = convertToWebPath(path.join('/css/admin/uploads', path.basename(showcasePath)));

        // Push image data to array
        imageUrls.push({
            thumbnailUrl,
            showcaseUrl,
            altText: 'Product Image'
        });

        await delay(100); // Add a 100ms delay
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      }
    }

    // Create a new product and save the image URLs
    const newProduct = new Product({
      name,
      category,
      price,
      stock,
      description,
      unit,
      images: imageUrls  // Store the image URLs (both thumbnail and showcase)
    });

    await newProduct.save();
    return res.status(201).json({ success: true, message: 'New Product added successfully.'});

    // res.redirect('view-products'); 
    } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
};

// ==========================================================================================================


  //edit Product Status(list/unlist)
  const edit_product_status =  async (req, res) => {
    
    try {
      const productId  = req.params.id;
      const { isListed } = req.body;
  
      const product = await Product.findByIdAndUpdate(
        productId,
        {isListed} , 
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json({ message: `Product ${isListed ? "listed" : "unlisted"} successfully!` });
    } catch (error) {
      res.status(500).json({ error: "Failed to update product status" });
    }
  }

  //edit Product Status(list/unlist)
  const edit_product_status_for_featured =  async (req, res) => {
    
    try {
      const productId  = req.params.id;
      const { featured } = req.body;
      console.log(featured);
      
  
      const product = await Product.findByIdAndUpdate(
        productId,
        {featured} , 
        { new: true }
      );
  console.log("000000000000 ",product.featured);
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json({ message: `Product successfully set as ${featured ? "Featured" : "Not Featured"}!` });
    } catch (error) {
      res.status(500).json({ error: "Failed to update product status-featured" });
    }
  }


  //-------------------------------------------Delete product---------------------------------------------------------
  const delete_product = async (req, res) => {
    
    try {
      const productId  = req.params.id;
  
      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  }



  module.exports ={
    get_add_product,
    view_products,
    add_Product,
    get_edit_product,
    edit_product,
    edit_product_status,
    edit_product_status_for_featured,
    delete_product,
  }