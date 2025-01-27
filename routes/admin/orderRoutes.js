const express = require('express');
const { viewOrdersList, orderDetailedView, updateOrderStatus } = require('../../controller/adminController/orderController');
const router = express.Router();

router.get('/view-orders',viewOrdersList)
router.get('/view-orders/:orderId',orderDetailedView)
router.patch('/view-orders/:orderId/update-status',updateOrderStatus)

module.exports = router;