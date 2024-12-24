const express = require('express')
const router = express.Router()

const authRoute = require('./authRoutes')
const login_and_signup = require('./login_and_signup')
const home_page = require('./home_routes')
const review = require('./review_routes')
const {  isUser, isGuest, isBlocked } = require('../../middleware/user/userAuthMiddleware')
const { logout } = require('../../controller/user/login_and_signup_Controller')
 

//Auth route
router.use('/',authRoute)

//register,login,otp,logout and verify otp
router.use('/',login_and_signup)

//Home page route
router.use('/',home_page)

//Product review
router.use('/product-detailed',isBlocked,review) 

//Logout
router.get("/logout",isUser,logout) 


module.exports = router 