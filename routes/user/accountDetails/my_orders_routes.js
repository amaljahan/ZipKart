const express = require('express');
const { view_my_orders, view_order, cancelOrder, return_product } = require('../../../controller/user/accountDetails/my_orders_controller');
const router = express.Router();

router.get("/my-orders",view_my_orders)
router.get("/view-order/:orderId",view_order)
router.patch("/view-order/:orderId/order/cancel",cancelOrder)
router.patch("/view-order/:orderId/order/return-product",return_product)

module.exports = router;