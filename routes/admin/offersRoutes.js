const express = require('express');
const { view_offers, add_offer, edit_offer, update_status_offer, delete_offer, view_add_offer, view_edit_offer } = require('../../controller/adminController/offersController');
const router = express.Router()


router.get("/view-offers", view_offers)
router.get("/view-offers/view-add-offer", view_add_offer)
router.post("/view-offers/add-offer", add_offer)

router.get("/view-offers/view-edit-offer", view_edit_offer)
router.post("/view-offers/edit-offer", edit_offer)


router.patch("/view-offers/update-status", update_status_offer)
router.delete("/view-offers/remove/:id", delete_offer)


module.exports = router ;