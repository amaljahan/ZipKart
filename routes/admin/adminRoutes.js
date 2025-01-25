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
const Orders = require('./orderRoutes')
const { isLogged, isAdmin } = require('../../middleware/admin/adminAuthMiddleware');
const { logout } = require('../../controller/user/login_and_signup_Controller');


//admin login
router.get('/login',isLogged,get_admin_login)
router.post('/login',post_admin_login)

router.get('/logout',isAdmin,logout)//Logout
router.use('/users',isAdmin,users) //Users
router.use('/categories',isAdmin,category)//category
router.use('/',isAdmin,dashboard)//dashboard
router.use('/products',isAdmin,products)//products
router.use('/orders',isAdmin,Orders)//Orders










module.exports = router



// ini vendath ithine run cheythu check cheyth nokkan
// login pagine