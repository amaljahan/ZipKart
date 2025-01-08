const express = require('express')
const { view_cart, updateCart, delete_from_cart } = require('../../../controller/user/cartController/cartController')
const router = express.Router()

router.get('/:id/cart',view_cart)
router.patch('/:id/cart/update-cart',updateCart)
router.delete('/:id/cart/remove-product/:pid',delete_from_cart)
module.exports = router