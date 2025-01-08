const User = require('../../model/user_model')

const isUser = async(req,res,next)=>{
   if(req.session.user){
        return next();
    }else{
        
     return res.redirect('/zipkart/user/home')
    }
    // next()
}   


const isGuest = async (req,res,next)=>{//for non login users
    console.log("Session Data:", req.session);
    if(req.session.user){
        return res.redirect('/zipkart/user/home')
    }else{
    
        return next();
    }
}
 
const isBlocked = async (req, res, next) => {
    if (req.session.userId) {
      try {
        // Check the user's status in the database (assuming you have a User model)
        const user = await User.findById(req.session.userId);
  
        if (user && user.isBlocked) {
          // If the user is blocked, log them out
          req.session.destroy((err) => {
            if (err) {
              return next(err);
            }
            const message="Your account has been blocked. Please contact support."
            // Redirect the user to the login page or any other page you want
            return res.redirect('/zipkart/user/login');
            // return res.status(403).json({message:"Your account has been blocked. Please contact support."})
           
            
          });
        } else {
          // If the user is not blocked, proceed to the next middleware or route
          return next();
        }
      } catch (err) {
        return next(err); // Handle any errors (e.g., database errors)
      }
    } else {
      // If no user is logged in, proceed to the next middleware or route
      return next();
    }
  };
  


  

module.exports = {
    isUser,
    isGuest,
    isBlocked,
    // isUserAlreadySignup
}  