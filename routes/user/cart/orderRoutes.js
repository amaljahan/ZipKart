const express = require('express');
const { create_order, view_order_success_page } = require('../../../controller/user/cartController/orderControlller');
const router = express.Router()


router.post('/order',create_order)
router.get('/order/success',view_order_success_page)


module.exports = router;


