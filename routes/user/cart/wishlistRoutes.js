const express = require('express');
const { get_wishlist, add_to_wishlist, wishlist_add_to_cart, remove_from_wishlist } = require('../../../controller/user/cartController/wishlist_Controller');
const router = express.Router()

router.get('/:id/wishlist',get_wishlist)
router.patch('/:id/wishlist/add-to-wishlist',add_to_wishlist)
router.patch('/:id/wishlist/update-cart',wishlist_add_to_cart)
router.patch('/:id/wishlist/remove-product/:pid',remove_from_wishlist)

module.exports = router;