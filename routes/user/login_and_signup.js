const express = require('express');
const router = express.Router();
const { 
    post_signup, 
    generate_otp, 
    verify_otp, 
    get_signup, 
    get_login, 
    post_login,
    logout, 
} = require('../../controller/user/login_and_signup_Controller');
const { isGuest } = require('../../middleware/user/userAuthMiddleware');



//register user 
router.get("/signup",isGuest,get_signup)
router.post("/signup",post_signup)


//Login user
router.get("/login",isGuest,get_login)
router.post("/login",post_login)

//generate otp
router.post("/generate-otp",generate_otp) 

//verify otp
router.post("/verify-otp",verify_otp)






module.exports = router;  