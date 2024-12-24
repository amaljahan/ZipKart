
const passport = require('passport');

// Initiate Google Signup
const googleSignup = passport.authenticate('google-signup', {
  scope: ['profile', 'email'],
});



// Callback for Google Signup after successful authentication and its redirection
const googleSignupCallback = (req, res, next) => {
  console.log("Amal");

  passport.authenticate('google-signup', { 
    failureRedirect: '/zipkart/user/signup' 
  }, (err, user, info) => {
    if (err) {
      return next(err); // Handle any errors that occurred during authentication
    }
    req.session.isBlocked = user.isBlocked;

    if (!user||req.session.isBlocked) {
      return res.redirect('/zipkart/user/signup'); // If user doesn't exist, redirect to signup
    }

    // If the user is authenticated, store user ID in session and redirect
    req.session.user = user.firstName;
    req.session.userId = user._id;
    return res.redirect('/zipkart/user/home'); // Redirect to home or dashboard
  })(req, res, next); // Pass request and response to passport's authenticate method
};


// ===========================================================================================

// Initiate Google Login
const googleLogin = passport.authenticate('google-login', {
  scope: ['profile', 'email'],
});



// Callback for Google Login
const googleLoginCallback = (req, res, next) => {
  passport.authenticate('google-login', { 
    failureRedirect: '/zipkart/user/login' 
  }, (err, user, info) => {
    if (err) {
      return next(err); // Handle errors
    }
    
    req.session.isBlocked = user.isBlocked;

    if (!user||req.session.isBlocked) {
      return res.redirect('/zipkart/user/login'); // Redirect to signup if no user
    }

    // If the user is authenticated, store user ID in session and redirect
    console.log("google login : ",user);
    
    req.session.user = user.firstName;
    req.session.userId = user._id;
    return res.redirect('/zipkart/user/home'); // Redirect to home or dashboard
  })(req, res, next); // Pass request and response to passport's authenticate method
};

module.exports = {
  googleSignup,
  googleSignupCallback,
  googleLogin,
  googleLoginCallback,
};
