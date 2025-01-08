const express = require('express')
const router = express.Router()

const cartRoutes = require('./cartRoutes')
const { isUser } = require('../../../middleware/user/userAuthMiddleware')
const checkoutRoutes = require('./checkoutRoutes')

router.use('/',isUser,cartRoutes)
router.use('/',isUser,checkoutRoutes)


module.exports = router