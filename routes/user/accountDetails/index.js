const express = require('express')
const router = express.Router()

const manageAccountRouter = require('./manageAccountRoutes')
const addressRouter = require('./addressRoutes')
router.use('/',manageAccountRouter)
router.use('/',addressRouter)


module.exports = router
