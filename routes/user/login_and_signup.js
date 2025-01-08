const express = require('express');
const router = express.Router();
const {  
    generate_otp, 
    get_signup, 
    get_login, 
    post_login,
    logout,
    get_otp_page,
    resend_otp,
    verify_otp_and_register, 
} = require('../../controller/user/login_and_signup_Controller');
const { isGuest, isBlocked } = require('../../middleware/user/userAuthMiddleware');




router.get("/signup",isGuest,get_signup) //register user 
router.get("/login",isGuest,get_login) //Login user
router.post("/login",post_login) //Login user
router.get("/otp",get_otp_page) //get otp page
router.post("/resend-otp",resend_otp) //resend Otp
router.post("/generate-otp",generate_otp) //generate otp
router.post("/verify-otp-register",verify_otp_and_register) //verify otp
router.get("/logout",logout) //logout



 
module.exports = router;  