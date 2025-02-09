const express = require('express');
const { view_coupons, add_coupon, edit_coupon, update_status_coupon, delete_coupon } = require('../../controller/adminController/couponsController');
const router = express.Router()


router.get("/view-coupons", view_coupons)
router.post("/view-coupons/add-coupon", add_coupon)
router.post("/view-coupons/edit-coupon", edit_coupon)
router.patch("/view-coupons/update-status", update_status_coupon)
router.delete("/view-coupons/remove/:id", delete_coupon)


module.exports = router ;