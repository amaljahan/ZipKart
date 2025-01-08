const express = require('express');
const { view_checkout_page } = require('../../../controller/user/cartController/checkoutController');
const router = express.Router()

router.get('/view-checkout',view_checkout_page)


module.exports  = router;