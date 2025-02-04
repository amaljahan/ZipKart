const express = require('express')
const { view_change_password, change_password } = require('../../../controller/user/changePasswordController/changePasswordController')
const router = express.Router()

router.get("/change-password",view_change_password)//render change password page
router.patch("/change-password/:id",change_password)//change password 

module.exports = router