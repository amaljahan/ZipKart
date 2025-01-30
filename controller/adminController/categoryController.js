const Category = require('../../model/adminModel/categoryModel')

//get category
const view_category = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const [categories, totalCategory] = await Promise.all([
        Category.find()
              .sort({ orderDate: -1 })
              .skip(skip)
              .limit(limit),
              Category.countDocuments(),
      ]);
  
      if (!categories) {
        res.status(400).json({ success: false, message: "No categories found." });
      }
  
      const totalPages = Math.ceil(totalCategory / limit);
  
      res.render('admin/category', {
        categories,
        currentPage: page,
        totalPages,
        skip,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error from categories' });
    }
  };

// Add Category
const add_category = async (req, res) => {    
    try {
      let { name, description } = req.body;
      name = name.toUpperCase();
      const ctgry = await Category.findOne({name})
      if(ctgry){
        return res.status(409).json({success:false, message:"Category name already exists! Please try with a new name."})//409 => dublicate or conflict with and existing one 
      }

      const category = new Category({ name, description });
      await category.save();
      res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  };

// Add Category
const get_add_category = async (req, res) => {
    
    try {
      res.render('admin/add_category')
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  };

  //Get Edit Category
const get_edit_category = async (req, res) => {
    // console.log("at edit");
    const categoryId = req.params.id
    const category = await Category.findById(categoryId)
    try {
        res.render('admin/edit_category',{category})

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

  //Edit Category
const edit_category = async (req, res) => {
    // console.log("at editfgf");

    try {
        let { name, description } = req.body;
        name = name.toUpperCase();
        console.log("Name :",name);
        

        const category = await Category.findByIdAndUpdate(
      // if(category.name)
        req.params.id,
        { name, description },
        { new: true }
        );
        if (!category) {
        return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}


//Toggle or Edit the Category Status
const edit_category_status = async (req, res) => {
    // console.log("at status");

    try {
      const { isListed } = req.body;
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { isListed },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ message: "Category status updated", category });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
}


//Delete category
const delete_category = async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Error deleting category' });
    }
  }


module.exports = {
    view_category,
    add_category,
    edit_category,
    edit_category_status,
    delete_category,
    get_add_category,
    get_edit_category
}
