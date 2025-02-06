const express = require('express')
const router = express.Router()

const cartRoutes = require('./cartRoutes')
const { isUser } = require('../../../middleware/user/userAuthMiddleware')
const checkoutRoutes = require('./checkoutRoutes')
const orderRoutes = require('./orderRoutes')
const wishlist = require("./wishlistRoutes")


router.use('/',isUser,cartRoutes)
router.use('/',isUser,checkoutRoutes)
router.use('/',isUser,orderRoutes)
router.use('/',isUser,wishlist)


module.exports = router