const express = require('express')
const router = express.Router()

const authRoute = require('./authRoutes')
const login_and_signup = require('./login_and_signup')
const home_page = require('./home_routes')
const review = require('./review_routes')
const {  isUser, isGuest, isBlocked } = require('../../middleware/user/userAuthMiddleware')
const accountDetails = require('./accountDetails/index')
const changePassword = require('./changePasswordRoute/changePasswordRoute')
const cartRout = require('./cart/index')


router.use('/',authRoute) //Auth route
router.use('/',login_and_signup) //register,login,otp,logout and verify otp
router.use('/',home_page) //Home page route
router.use('/product-detailed',isBlocked,review) //Product review
router.use('/accountDetails',isUser ,isBlocked,accountDetails) //AccountDetails
router.use('/accountDetails',isUser ,isBlocked,changePassword)
router.use('/',cartRout)
 



module.exports = router 