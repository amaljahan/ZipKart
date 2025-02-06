const express = require('express');
const { create_order, view_order_success_page, verify_payment_of_order } = require('../../../controller/user/cartController/orderControlller');
const router = express.Router()


router.post('/order',create_order)
router.get('/order/success',view_order_success_page)
router.post('/order/verify-payment/:orderId',verify_payment_of_order)


module.exports = router;


