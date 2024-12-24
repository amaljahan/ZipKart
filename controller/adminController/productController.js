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
      // Usage of  populate to get the category data alongside product data
      const products = await Product.find().populate('category', 'name'); // Populate only the 'name' field of the category
      // console.log("products: ",products);
      
      // Normalize image URLs(because windown providing the backslash instead of forward slash ( universal style))
      // products.forEach(product => {
      //   if (product.images && product.images.length > 0) {
      //     product.images = product.images.map(image => ({
      //       thumbnailUrl: image.thumbnailUrl.replace(/\\/g, "/"), // Normalize path for thumbnail
      //       showcaseUrl: image.showcaseUrl.replace(/\\/g, "/"), // Normalize path for showcase
      //       altText: image.altText, // Retain altText as is
      //     }));
      //   }
      // });      
      res.render("admin/products", { products });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  };
  





//get add product 
const get_add_product =  async (req, res) => {
    try {
        const categories = await Category.find();  // Fetch all categories from the database
        res.render('admin/add_product', { categories });  // Pass categories to the EJS template
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching categories');
    }
  }

//get edit product 
const get_edit_product =  async (req, res) => {
  const productId = req.params.id
  const product = await Product.findById(productId).populate('category','name');
  const categories = await Category.find();  // Fetch all categories from the database
    try {
        res.render('admin/edit_product', { product,categories });  // Pass categories to the EJS template
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching categories');
    }
  }



// -----------------------------------------  edit product  --------------------------------------------------------------
const edit_product = async (req, res) => {
  try {
    // console.log(typeof "name" ==="string");
    console.log("test in edit product");
    
    const productId = req.params.id; // Extract product ID from the request parameters
    const { name, category, price, stock, description, unit, existingImages } = req.body;
    
    console.log("existingImages :",existingImages);
    // const product = await Product.findById(productId);

    // Fetch the product from the database
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product details
    product.name = name.trim();
    product.category = category;
    product.price = parseFloat(price);
    product.stock = parseInt(stock);
    product.description = description.trim();
    product.unit = unit;


     // Initialize imageUrls with existing images (if any)
     let imageUrls = [];

     // Check if existingImages is defined and is an array
     if (Array.isArray(existingImages)) {
       imageUrls = existingImages.map(image => ({
         thumbnailUrl: image.replace(/\\/g, "/"), // Normalize the path to forward slashes
         showcaseUrl: image.replace(/\\/g, "/"),  // Assuming showcaseUrl is same for existing images
         altText: "Product Image", // Default altText if not provided
       }));
     }

    // Handle newly uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Define paths for resized images
        const thumbnailPath = path.join("public","css","admin","uploads",`thumb-${Date.now()}${path.extname(file.originalname)}`
        );
        const showcasePath = path.join("public","css","admin","uploads",`showcase-${Date.now()}${path.extname(file.originalname)}`
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

    // Ensure that there are at least 3 images (either new or existing)
    if (imageUrls.length < 3) {
      return res.status(400).json({ message: "At least 3 images are required" });
    }

    product.images = imageUrls;

    // Save updated product
    await product.save();

    res.redirect("/zipkart/admin/products/view-products");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error editing product", error: err.message });
  }
};



// ============================================= Create Product =============================================================

const add_Product = async (req, res) => {
  console.log("workeddddddd");

  try {
    const { name, category, price, stock, description, unit } = req.body;
    const imageUrls = [];  // This will hold the URLs of resized images

    // Loop through the uploaded images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // const timestamp = Date.now();
        // Define the file paths for the resized images
        const thumbnailPath = path.join('public', 'css', 'admin', 'uploads', `thumb-images-${Date.now()}${path.extname(file.originalname)}`);
        const showcasePath = path.join('public', 'css', 'admin', 'uploads', `showcase-images-${Date.now()}${path.extname(file.originalname)}`);

        // Resize for Admin Side (Thumbnail)
        await sharp(file.path)
          .resize(150, 150)  // Resize to 150x150 for admin side
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

    res.redirect('view-products'); 
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
      console.log('edit product status',req.params,'edit product status',productId);
  
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


  //-------------------------------------------Delete product---------------------------------------------------------
  const delete_product = async (req, res) => {
    console.log("at delete product");
    
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
    delete_product,
  }