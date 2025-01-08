const express = require('express')
const { view_user_details, view_edit_user_details, edit_user_details } = require('../../../controller/user/accountDetails/manageAccountController')
const router = express.Router()

router.get("/user-profile/:id",view_user_details) //view user details page
router.get('/edit-user-profile/:id',view_edit_user_details) //view edit user details page
router. patch('/edit-user-profile/:id',edit_user_details)//update user details




module.exports = router
