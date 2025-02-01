const User = require('../../../model/user_model')


const view_user_details = async(req,res)=>{
     
     try{
          const userId = req.params.id
          const user = await User.findById(userId)
          console.log("user :",user);
          
          res.render('user/accountDetails/accountDetails',{user,session:req.session})
     }
     catch(err){
          console.log("Error: ",err);  
          res.status(500).json({message:"server error"})
     }
} 
const view_edit_user_details = async(req,res)=>{
     console.log("AT view edit details or manage account ",req.session);
     
     try{
          const userId = req.params.id
          const user = await User.findById(userId)
          console.log("user :",user);
          
          res.render('user/accountDetails/editProfile',{user,session:req.session})
     }
     catch(err){
          console.log("Error: ",err);  
          res.status(500).json({message:"server error"})
     }
} 

const edit_user_details = async (req,res)=>{
     const {firstName, lastName, email} = req.body
     const user = await User.findByIdAndUpdate(
               req.params.id,
               {firstName,lastName},
               {new:true}
          );
          if(!user){
               return res.status(404).json({ error: "User not found" });
          }
          console.log(user.firstName);
          
          req.session.user = user.firstName
          res.status(200).json({ success:"success", message: "User updated successfully" });

     try{
          
          
     }
     catch(err){
          console.log("Error: ",err);  
          res.status(500).json({message:"server error"})
     }
}



module.exports = {
     view_user_details, 
     view_edit_user_details,
     edit_user_details
}