require('dotenv').config()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const get_admin_login = async(req,res)=>{
    console.log("get admin login test");
    
    try{
        res.render('admin/adminLogin',{message:null,errorsToShowInLogin:null})
    }catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}

const post_admin_login = async(req,res)=>{
    const {email,password} = req.body; 
    console.log(req.body, ADMIN_EMAIL,ADMIN_PASSWORD);
    

    try{
        

                if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
            req.session.admin = email;
            res.status(200).json({success:true,message:"Login successfully",redirectUrl:"/zipkart/admin/dashboard"})
        }
        else {
            res.status(400).json({success:false,message:"Failed to Login"})
        }
    }catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}


const adminLogout = async (req,res)=>{
    try{
        req.session.admin = null;
       
        res.redirect('/zipkart/admin/login')
           
    }
    catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}

module.exports = {
    get_admin_login,
    post_admin_login,
    adminLogout,
}