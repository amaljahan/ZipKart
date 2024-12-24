const { text } = require('express');
const nodeMailer = require('nodemailer');
require('dotenv').config();

const client = nodeMailer.createTransport({
    service:"Gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const sendOtp = async(email,otp)=>{
    const mailOptions = {
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Zipkart OTP code",
        text:`otp for Zipkart signup is :${otp}`
    }
    try{
        await client.sendMail(mailOptions);
        console.log("otp successfully send to email");
        
    }
    catch(err){
        console.log("error sending otp email: ",err);
        throw new Error('failed to send Otp Email')
        
    }
}
module.exports = sendOtp