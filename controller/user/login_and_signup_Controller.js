const User = require("../../model/user_model")
const Otp = require("../../model/otp")
const bcrypt = require("bcryptjs");
const crypto = require('crypto')//it is used to generate random string
const sendOtp = require('../../utils/sendMail');
const { log } = require("console");
const Product = require('../../model/adminModel/product_model');
const { render } = require("ejs");




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



//Login - get
// ======================================================================
const get_login = async(req,res)=>{
    try{
        res.render('user/login',{message:null})
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
    console.log("req.body ", req.body)
    const {email,password} = req.body;
    try{

    //    ==========================================================
        const user =await User.findOne({email});
        
        if(!user){
            return res.status(400).json({message:"Invalid credentials."})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials."})

        }
        if(user.isBlocked){
            return res.status(403).json({message:"Your account has been blocked. Please contact support."})

        }
        if(user && isMatch){
            // req.session.user = user.firstName
            req.session.user = user.firstName
            req.session.userId = user._id
            return res.json({redirectUrl:'/zipkart/user/home'})
             
        }
    }
    catch(err){
        console.log("Error: ",err);
        res.status(500).json({message:"server error"})
    }
}
 


// ========================creating otp numbers===============================
async function createOtp(email){
    const isExistOtpUser = await Otp.find({email})
    if(isExistOtpUser){
        console.log("existing otp email id",isExistOtpUser)
        await Otp.deleteMany({ email });
        console.log("existing otp email id deleted",isExistOtpUser)
      }
    const otp = crypto.randomInt(1000,9999).toString();
    console.log("OTP ",otp , typeof otp)
    const hashedOtp = await bcrypt.hash(otp,10) 
    const newOtp = new Otp({
        email,
        otp:hashedOtp,
        otpExpiresAt:Date.now() +1*60*1000,//1mnt
    })
    await newOtp.save();
    
    await sendOtp(email,otp);
}
// =======================================================


const generate_otp = async(req,res)=>{
    const {firstName,lastName,email,password}=req.body
    console.log(req.body);
    
    try{
        
        const isExistUser = await User.findOne({email})
        if(isExistUser){
            return res.status(400).json({message:"User already exist, try with another mail"})

        }      
        
        createOtp(email)//calling for creating a function

        return res.render('user/otp',{firstName,lastName,email,password})
                // res.redirect('otp')
                

    }catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})

    }

}

const resend_otp = async(req,res)=>{
    const {email} = req.body
    try{
        const isExistUser = await User.findOne({email})
        if(isExistUser){
            return res.status(400).json({message:"User already exist, try with another mail"})
        }      
        createOtp(email);
        return res.status(200).json({message:"Resend Otp send successfully."})


    }catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})

    }

}


//verify otp
const verify_otp_and_register = async (req,res)=>{
    const {firstName,lastName,email,password,otp} = req.body;
    try{
        const user = await User.findOne({email})
        if(user){
            return res.render('user/signup',{message:"User already Exist, try another mail"})
        }
        const OtpEmail = await Otp.findOne({email})
        if(!OtpEmail){
            // return res.status(400).json({message:"user not found"})
            return res.render('user/signup',{message:"Mail id not found"})
        }

        const otpMatch = await bcrypt.compare(otp,OtpEmail.otp)


        if(!otpMatch){
            // return res.render('user/signup',{message:"invalid otp "})
            return res.status(400).json({message:" invalid otp "}) 
        }
        if(OtpEmail.otpExpiresAt < Date.now()){
            return res.status(400).json({message:"Otp expired"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        // console.log(password,hashedPassword)
        
        
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
        

    }catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})
    }  
}


//Logout
const logout = async (req,res)=>{
    
    try{
        req.session.destroy((err)=>{
            if(err){
                console.log('error while destroying session; ',err);
                return res.redirect('/zipkart/user/home')
                
            }
           return res.status(200).json({success: true, message: "Logout successfully",url:'/zipkart/user/home'})
        }) 
    }
    catch(err){ 
        console.error("Error during logout:", err);
        res.status(500).send("Internal Server Error");
    }
}


const forgot_password_email_type_page = async(req,res)=>{
    const email = req.body
    console.log("body ....: " , req.body)
    try {

        res.render("user/changePassword/frgtPswdEmailVerify")
        
    } catch (error) {
        console.log("Error from forgot password: ",err);  
        res.status(500).json({message:"server error"})
    }
}

//otp verify and rendering otp page
const forgot_password_email_verify_otp_generation = async(req,res)=>{
    const {email,password} = req.   body
    console.log("body ....: " , req.body)
    try {
        const isExistUser = await User.findOne({email})
        
        if(!isExistUser){
            return res.status(400).json({success: false, message:"No user found on this Email!, try with another Email"})

        }  

        createOtp(email)
        // res.status(201).json({ success: true, message: "Otp generated successfully", email });
        res.render("user/changePassword/forgotpasswordOtp", { email,password });

    } catch (error) {
        console.log("Error from forgot_password_email_verify_otp_generation: ",err);  
        res.status(500).json({message:"server error"})
    }
}


// const rendering_otp_page = async(req,res)=>{
//     const email = req.query.email
//     console.log("body ....: " , req.query)
//     try {
        
        
//         res.render("user/changePassword/forgotpasswordOtp",{email})
        
//     } catch (error) {
//         console.log("Error from rendering otp page: ",err);  
//         res.status(500).json({message:"server error"})
//     }
// }


const verify_otp_and_update_password = async(req,res)=>{
    const {email, password,otp} = req.body
    console.log("body ....: " , req.body)
    try {
        const isExistUser = await User.findOne({email})
        
        if(!isExistUser){
            return res.status(400).json({success: false, message:"No user found on this Email!, try with another Email"})
        } 

        const OtpEmail = await Otp.findOne({email})
        console.log("Otp email ....: " , OtpEmail)

        if(!OtpEmail){
            return res.status(400).json({success: false, message:"User not found"})
        }
        const otpMatch = await bcrypt.compare(otp,OtpEmail.otp)
        console.log("Otp mathch ....: " , otpMatch)


        if(!otpMatch){
            // return res.render('user/signup',{message:"invalid otp "})
            return res.status(400).json({message:" invalid otp "}) 
        }
        if(OtpEmail.otpExpiresAt < Date.now()){
            return res.status(400).json({message:"Otp expired"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        console.log("Password and its hashed password.",password,hashedPassword)
        
        isExistUser.password = hashedPassword
        await isExistUser.save()

        return res.status(200).json({success: true, message:"Password changed successfully."})

        
    } catch (error) {
        console.log("Error from rendering otp page: ",err);  
        res.status(500).json({message:"server error"})
    }
}


const resend_otp_of_forgot = async(req,res)=>{
    const {email} = req.body
    try{
        const isExistUser = await User.findOne({email})
        
        if(!isExistUser){
            return res.status(400).json({success: false, message:"No user found on this Email!, try with another Email"})
        }      
        createOtp(email);
        return res.status(200).json({message:"Resend Otp send successfully."})


    }catch(err){
        console.log('Error:',err);
        res.status(500).json({message:"server error"})

    }

}







module.exports = {
    get_signup,
    // post_signup,
    get_login,
    post_login,
    generate_otp,
    verify_otp_and_register,
    logout,
    // get_otp_page,
    resend_otp,
    forgot_password_email_type_page,
    forgot_password_email_verify_otp_generation,
    verify_otp_and_update_password,
    resend_otp_of_forgot
}