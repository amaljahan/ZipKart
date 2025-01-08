const User = require('../../../model/user_model')
const bcrypt = require('bcryptjs')

const view_change_password  = async(req,res)=>{
    try{
        res.render('user/changePassword/change_password',{session: req.session})
    }
    catch(err){
        console.log("Error: ",err);  
          res.status(500).json({message:"server error"})
    }
}


const change_password  = async(req,res)=>{
    const {current_password, new_password} = req.body
    console.log("test",current_password,new_password);
    const userId = req.params.id
    
    try{
      
        const user = await User.findById(userId)
        console.log(user.password);
    
        const isTrue = await bcrypt.compare(current_password , user.password)
        console.log(isTrue);
        
        if(!user){
            return res.status(400).json({success:false,message:"unexpected error occured, please try again."})

        }
        if(!isTrue){
           return res.status(400).json({success:false,message:"Incorrect Current Password, please try again."})
        }
        hashed_new_password = await bcrypt.hash(new_password,10)
        user.password = hashed_new_password
        await user.save();
        res.status(200).json({success:"success",message:"Password updated successfully."})

    }
    catch(err){
        console.log("Error: ",err);  
          res.status(500).json({message:"server error"})
    }
}

module.exports = {
    view_change_password,
    change_password
}