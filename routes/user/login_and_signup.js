const express = require('express');
const router = express.Router();
const {  
    generate_otp, 
    get_signup, 
    get_login, 
    post_login,
    logout,
    
    resend_otp,
    verify_otp_and_register,
    forgot_password, 
} = require('../../controller/user/login_and_signup_Controller');
const { isGuest, isBlocked } = require('../../middleware/user/userAuthMiddleware');




router.get("/signup",isGuest,get_signup) //register user 
router.get("/login",isGuest,get_login) //Login user
router.post("/login",post_login) //Login user
router.post("/resend-otp",resend_otp) //resend Otp
router.post("/generate-otp",generate_otp) //generate otp
router.post("/verify-otp-register",verify_otp_and_register) //verify otp
router.get("/logout",logout) //logout
router.get("/forgot-password",forgot_password)//forgot password 




 
module.exports = router;  