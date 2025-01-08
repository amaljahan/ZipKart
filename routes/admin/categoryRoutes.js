const express = require('express');
const { view_category, add_category, edit_category, edit_category_status, delete_category, get_add_category, get_edit_category } = require('../../controller/adminController/categoryController');
const router = express.Router(); 




//view category
router.get('/view-category',view_category)

//add category 
router.get('/add-category',get_add_category)
router.post('/add-category',add_category)

//edit category
router.get('/edit-category/:id',get_edit_category)
router.post('/edit-category/:id',edit_category)

//edit category status 
router.patch('/edit-category/:id/status',edit_category_status)

//Delete category
router.delete('/delete-category/:id',delete_category)





module.exports = router;