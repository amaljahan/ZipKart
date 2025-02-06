const express = require('express');
const { viewOrdersList, orderDetailedView, updateOrderStatus, return_approve_or_reject } = require('../../controller/adminController/orderController');
const router = express.Router();

router.get('/view-orders',viewOrdersList)
router.get('/view-orders/:orderId',orderDetailedView)
router.patch('/view-orders/:orderId/update-status',updateOrderStatus)
router.patch("/view-order/:orderId/handle-return",return_approve_or_reject)


module.exports = router;