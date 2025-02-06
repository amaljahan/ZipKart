const express = require('express');
const { get_wishlist, add_to_wishlist } = require('../../../controller/user/cartController/wishlist_Controller');
const router = express.Router()

router.get('/:id/wishlist',get_wishlist)
router.patch('/:id/wishlist/add-to-wishlist',add_to_wishlist)

module.exports = router;