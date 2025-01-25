const express = require('express');
const { viewOrdersList, orderDetailedView } = require('../../controller/adminController/orderController');
const router = express.Router();

router.get('/view-orders',viewOrdersList)
router.get('/view-orders/:orderId',orderDetailedView)

module.exports = router;