const express = require('express')
const connectDB = require('./config/dbConnection');
const morgan = require("morgan")
const ejs = require('ejs')
const app = express()
const path = require('path')
const session = require('express-session');
require("dotenv").config()
const passport = require('passport');
require('./config/google-passport_auth')


connectDB()
const port = process.env.PORT||3433;

app.use(express.urlencoded({extended:true}))                     
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")));
app.use(morgan("dev"))

app.use(session({
        resave: false, // forces the session to be saved back to the session store
        saveUninitialized: true, // forces a session to be saved even if not modified
        secret: process.env.SECRET || 'secret',
        cookie: { secure: false } // Use `true` for HTTPS, `false` for development (HTTP)

      }));

// Initialize Passport  
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store'); 
  next();
});


app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


//admin routes connecting 
app.use("/zipkart/admin",require("./routes/admin/adminRoutes"))

//user routes connecting
app.use("/zipkart/user",require("./routes/user/index"))
 

app.use((req,res)=>{
  res.render('errors/_404')
})

app.use((err, req, res, next) => {
  console.error(err);  t
  res.status(500).json({
    message: 'Unexpected server error. Please try again later.'
  });
});

app.listen(port,()=>{ 
    console.log(`server running on http://localhost:${port}/zipkart/user/home
        `)
})