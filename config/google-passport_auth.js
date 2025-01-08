const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../model/user_model');
require('dotenv').config();

// ----------------------USER SERIALIZERS------------------
passport.serializeUser((user, done) => {
  done(null, { id: user._id.toString(), email: user.email }); // Convert ObjectId to string
});

passport.deserializeUser((obj, done) => {
  User.findById(obj.id)
    .then((user) => {
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user);
    })
    .catch(done);
});

// ----------------------GOOGLE STRATEGIES------------------

// Google Signup Strategy
passport.use(
    "google-signup",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_SIGNUP,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let existingUser = await User.findOne({ email: profile.emails[0].value });
          console.log("google existing user=========: ", existingUser);
  
          if (existingUser) {
            if (existingUser.googleId) {
              // User already signed up with Google
              return done(null, false, { message: "User already exists with this email. Please log in." });
            }
            if (!existingUser.googleId) {
              // Update Google details for the existing user
              existingUser.googleId = profile.id;
              existingUser.thumbnail = profile.photos[0].value;
              existingUser.firstName = profile.name.givenName;
              existingUser.lastName = profile.name.familyName;
              await existingUser.save();
  
              return done(null, existingUser); // Pass the user object for successful authentication
            } else {
              // User already exists with a Google account
              return done(null, existingUser);
            }
          } else {
            // Create a new user
            const newUser = new User({
              googleId: profile.id,
              thumbnail: profile.photos[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
            });
            await newUser.save();
            return done(null, newUser);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );



// For Google Login
passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_LOGIN
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({ googleId: profile.id, isBlocked: false });

        if (existingUser) {
          return done(null, existingUser);
        }

        existingUser = await User.findOne({ email: profile.emails[0].value, isBlocked: false });

        if (existingUser) {
          existingUser.googleId = profile.id;
          existingUser.thumbnail = profile.photos[0].value;
          await existingUser.save();

          return done(null, existingUser);
        } else {
          return done(null, false, {
            message: "User does not exist or is blocked. Please sign up.",
          });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
