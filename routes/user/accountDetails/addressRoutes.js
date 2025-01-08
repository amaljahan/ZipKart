const express = require('express')
const router = express.Router()
 
const { view_addresses, get_add_address, get_edit_address, add_address, edit_address, delete_address } = require('../../../controller/user/accountDetails/manage_addressesController')

//Addresses
router.get("/manage-addresses/all-addresses/:id",view_addresses)//user id
router.get("/manage-addresses/add-new-address",get_add_address)
router.post("/manage-addresses/add-new-address",add_address)
router.get("/manage-addresses/edit-address/:id",get_edit_address) //addresss id
router.patch("/manage-addresses/edit-address/:id",edit_address)//address id
router.delete("/manage-addresses/delete-address/:id",delete_address)//address id


module.exports = router      