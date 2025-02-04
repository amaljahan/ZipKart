const express = require('express')
const router = express.Router()

const manageAccountRouter = require('./manageAccountRoutes')
const addressRouter = require('./addressRoutes')
const myOrders = require('./my_orders_routes')
const wallet = require('./walletRoutes')
const changePassword = require('./changePasswordRoute')


router.use('/',manageAccountRouter)
router.use('/',addressRouter)
router.use('/',myOrders)
router.use('/',changePassword)
router.use('/',wallet)   


 
module.exports = router
