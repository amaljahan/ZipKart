
const passport = require('passport');

// Initiate Google Signup
const googleSignup = passport.authenticate('google-signup', {
  scope: ['profile', 'email'],
});



// Callback for Google Signup after successful authentication and its redirection
const googleSignupCallback = (req, res, next) => {
  
  console.log("at google signup");


  passport.authenticate('google-signup', { 
    failureRedirect: '/zipkart/user/signup' 
  }, (err, user, info) => {
    if (err) {
      return next(err); // Handle any errors that occurred during authentication
    }
    req.session.isBlocked = user.isBlocked;

    if (!user) {
      const errorMessage = info && info.message ? info.message : 'User signup failed.';
      return res.redirect(`/zipkart/user/signup?error=${encodeURIComponent(errorMessage)}`);//encodeURIComponent() = ithu upayogikkunnathu stringin ee formilekk convert cheyyanaanu => /signup?error=User%20already%20exists%21
    }
    if(req.session.isBlocked){
      return res.redirect(`/zipkart/user/signup?error=${encodeURIComponent('Your account has been blocked. Please contact support.')}`);

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
  console.log("google auth login"); 
  
  passport.authenticate('google-login', { 
    failureRedirect: '/zipkart/user/login' 
  }, (err, user, info) => {
    if (err) {
      return next(err); // Handle errors
    }
    
    req.session.isBlocked = user.isBlocked;
    
    if(req.session.isBlocked){
      return res.redirect(`/zipkart/user/login?error=${encodeURIComponent('Your account has been blocked. Please contact support.')}`);

    }
    if (!user) {
      const errorMessage = info && info.message ? info.message : 'User Login failed.';
      return res.redirect(`/zipkart/user/login?error=${encodeURIComponent(errorMessage)}`);//encodeURIComponent() = ithu upayogikkunnathu stringin ee formilekk convert cheyyanaanu => /signup?error=User%20already%20exists%21
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
