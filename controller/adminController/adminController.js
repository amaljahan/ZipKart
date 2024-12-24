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

//===================================================================
        if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
            req.session.admin = email;
            res.redirect('dashboard')
        }
        else {
            res.status(400).json({success:false,message:"Failed to Login"})
        }
    }catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}


const logout = async (req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                console.log('error while destroyin session; ',err);
                return res.redirect("/zipkart/admin/dashboard")
            }else{
                return res.redirect('/zipkart/admin/login')
            }
        })
    }
    catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}

module.exports = {
    get_admin_login,
    post_admin_login,
    logout
}