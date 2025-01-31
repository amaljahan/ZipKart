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
    forgot_password_email_type_page,
    forgot_password_email_verify_otp_generation,
    verify_otp_and_update_password, 
    resend_otp_of_forgot,
} = require('../../controller/user/login_and_signup_Controller');
const { isGuest, isBlocked } = require('../../middleware/user/userAuthMiddleware');




router.get("/signup",isGuest,get_signup) //register user 
router.get("/login",isGuest,get_login) //Login user
router.post("/login",post_login) //Login user
router.post("/resend-otp",resend_otp) //resend Otp
router.post("/generate-otp",generate_otp) //generate otp
router.post("/verify-otp-register",verify_otp_and_register) //verify otp
router.get("/logout",logout) //logout

router.get("/forgot-password",forgot_password_email_type_page)//forgot password 
router.post("/forgot-password/verify",forgot_password_email_verify_otp_generation)//verifying email for that requesting otp
// router.get("/forgot-password/verify/render-otp",rendering_otp_page)//otp page view/
router.patch("/forgot-password/verify/render-otp/update-password",verify_otp_and_update_password)//forgot password 
router.post("/forgot-password/verify/render-otp/update-password/resend-otp",resend_otp_of_forgot) //resend Otp





 
module.exports = router;  