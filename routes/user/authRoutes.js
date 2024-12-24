


const express = require('express');
const router = express.Router();
const {
  googleSignup,
  googleSignupCallback,
  googleLogin,
  googleLoginCallback,
} = require('../../controller/user/google_auth_controller');


//Signup
// Google OAuth routes
router.get('/auth/google/signup',googleSignup);
router.get('/auth/google/signup/callback', googleSignupCallback);


//Login
router.get('/auth/google/login',googleLogin);
router.get('/auth/google/login/callback', googleLoginCallback);
 
module.exports = router;
