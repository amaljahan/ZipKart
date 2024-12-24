const express = require('express');
const { 
    get_admin_login, 
    post_admin_login,
    
} = require('../../controller/adminController/adminController');
const router = express.Router(); 
const users = require('./usersRoutes')
const category = require('./categoryRoutes')
const dashboard = require('./dashboardRoutes')
const products = require('./productsRoutes');
const { isLogged, isAdmin } = require('../../middleware/admin/adminAuthMiddleware');
const { logout } = require('../../controller/user/login_and_signup_Controller');


//admin login
router.get('/login',isLogged,get_admin_login)
router.post('/login',post_admin_login)

//Logout
router.get('/logout',isAdmin,logout)

 
//Users
router.use('/users',isAdmin,users)

//category
router.use('/categories',isAdmin,category)

//dashboard 
router.use('/',isAdmin,dashboard)
 
 

//products
router.use('/products',isAdmin,products)










module.exports = router



// ini vendath ithine run cheythu check cheyth nokkan
// login pagine