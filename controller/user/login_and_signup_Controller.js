const User = require("../../model/user_model")
const Otp = require("../../model/otp")
const bcrypt = require("bcryptjs");
const crypto = require('crypto')//it is used to generate random string
const sendOtp = require('../../utils/sendMail');
const { log } = require("console");
const Product = require('../../model/adminModel/product_model')




//register - get
// ======================================================================
const get_signup = async(req,res)=>{
    try{
        // let errorsToShowInSignup = [];
        res.render('user/signup',{message:null,errorsToShowInSignup:null})
    }
    catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}

//register - post
// ======================================================================
const post_signup = async (req,res)=>{
    


    let errorsToShowInSignup = [];
    const {firstName,lastName,email,password,otp,message}=req.body
    console.log("req body : ",req.body)
    try{
        if(message){
            return  res.render('user/signup',{message:"user already exist ",errorsToShowInSignup:[]})

        }
        //Validation
// ===================================================================


        if (!firstName || firstName.trim() === '') {
            errorsToShowInSignup.push("First Name is required.");
        } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
            errorsToShowInSignup.push("Invalid Name format.");
        }
        if (!lastName || lastName.trim() === '') {
            errorsToShowInSignup.push("First Name is required.");
        } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
            errorsToShowInSignup.push("Invalid Name format.");
        }

        if (!email || email.trim() === '') {
            errorsToShowInSignup.push("Email is required.");
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
            errorsToShowInSignup.push("Invalid email format.");
        }
       

        if (!password || password.trim() === '') {
            errorsToShowInSignup.push("Password is required.");
          } else if (password.length < 8) {
            errorsToShowInSignup.push("Password must be at least 8 characters long.");
          }

          
          if (errorsToShowInSignup.length > 0) {
            return res.render('user/signup', {message:null, errorsToShowInSignup });
          }

// ===============================================================


        const existUser = await User.findOne({email})
        if(existUser){
            return  res.render('user/signup',{message:"user already exist ",errorsToShowInSignup:[]})
        }
        const OtpEmail = await Otp.findOne({email})
        
        const otpMatch = await bcrypt.compare(otp,OtpEmail.otp)
        if(!otpMatch){
            return res.render('user/signup',{message:"invalid otp ",errorsToShowInSignup:[]})
            // return res.status(400).json({message:"user already exist "}) 
        }
        const hashedPassword = await bcrypt.hash(password,10)
        console.log(password,hashedPassword)


        const newUser = new User({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            
        });
        await newUser.save();
        console.log("newUser",newUser)
       
        req.session.user = newUser.firstName
        req.session.userId = newUser._id
        res.redirect('home')
        // res.status(201).json({message:"user registered successfully"})
        
    }catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})
    }
}


//Login - get
// ======================================================================
const get_login = async(req,res)=>{
    try{
        res.render('user/login',{message:null,errorsToShowInLogin:null})
    }
    catch(err){
        console.log("Error: ",err);
        res.status(500).json({message:"server error"})
    }
}


//Login - post
// ======================================================================
const post_login = async(req,res)=>{
    const products  = await Product.find()
    // console.log("req.body ", req.body)
    const {email,password} = req.body;
    let errorsToShowInLogin = []
    try{

         //Validation
// ===================================================================
        if (!email || email.trim() === '') {
            errorsToShowInLogin.push("Email is required.");
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
            errorsToShowInLogin.push("Invalid email format.");
        }

        if (!password || password.trim() === '') {
            errorsToShowInLogin.push("Password is required.");
        } else if (password.length < 8) {
            errorsToShowInLogin.push("Password must be at least 8 characters long.");
        }

        if (errorsToShowInLogin.length > 0) {
            return res.render('user/login', {message:null, errorsToShowInLogin });
        }

// ==============================================================
        const user =await User.findOne({email});
        
        if(!user){
            return res.render('user/login',{message:"Invalid credentials.",errorsToShowInLogin:null})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.render('user/login',{message:"Invalid credentials.",errorsToShowInLogin:null})

        }
        if(user && isMatch){
            // req.session.user = user.firstName
            req.session.user = user.firstName
            req.session.userId = user._id
            res.redirect('/zipkart/user/home')
        }
    }
    catch(err){
        console.log("Error: ",err);
        res.status(500).json({message:"server error"})
    }
}
 







// ============================================================================
const generate_otp = async (req,res)=>{
console.log("generate otp; ",req.body);

    const {email} = req.body
    try{

        const user = await User.findOne({email})
        if(user){
            return res.status(200).json({message:"user already exist"})

        }
        const existUser = await Otp.findOne({email})
        if(existUser){
            console.log("existing otp email id",existUser)
            await Otp.deleteOne({ _id: existUser._id });//===========================================================z
            console.log("existing otp email id deleted",existUser)
          }
        const otp = crypto.randomInt(1000,9999).toString();
        console.log("OTP ",otp , typeof otp)
        const hashedOtp = await bcrypt.hash(otp,10) 
        const newOtp = new Otp({
            email,
            otp:hashedOtp,
            otpExpiresAt:Date.now() +10*60*1000,//10mnt
        })
        await newOtp.save();
        
        await sendOtp(email,otp);
        res.status(200).json({message:"Otp sent to email"})
    }catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})

    }
}



//verify otp
const verify_otp = async (req,res)=>{
    const {email,otp} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        const compareOtp = await bcrypt.compare(otp,user.otp);


        if(!compareOtp||user.otpExpiresAt < Date.now()){
            return res.status(400).json({message:"user not found or otp expired"})
        }

        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();
        res.status(200).json({message:"otp verified successfully , logged in"})

    }catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})
    }  
}


//Logout
const logout = async (req,res)=>{
    console.log("Logouted....");
    
    try{
        req.session.destroy((err)=>{
            if(err){
                console.log('error while destroyin session; ',err);
                return res.redirect('/zipkart/user/home')
                
            }
            res.redirect('/zipkart/user/home')
        })
    }
    catch(err){
        console.error("Error during logout:", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    get_signup,
    post_signup,
    get_login,
    post_login,
    generate_otp,
    verify_otp,
    logout,
}