const express = require('express')
const router = express.Router()

const manageAccountRouter = require('./manageAccountRoutes')
const addressRouter = require('./addressRoutes')
const myOrders = require('./my_orders_routes')

router.use('/',manageAccountRouter)
router.use('/',addressRouter)
router.use('/',myOrders)



module.exports = router
