
const User = require('../../model/user_model')


//get users
const view_users = async(req,res)=>{
    try{
        const users = await User.find()
        res.render('admin/usersView',{users})
    }
    catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}


//block & unblock
const block_unblock = async(req,res)=>{
    const {userId, isBlocked} = req.body;
    // console.log("body: ",req.body);
    
    try{
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isBlocked: isBlocked },
            { new: true } // Return the updated document
          );
          if (updatedUser) {
            res.json({ success: true, message: 'User status updated successfully' });
          } else {
            res.status(404).json({ success: false, message: 'User not found' });
          }
    }
    catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}

module.exports = {
    view_users,
    block_unblock,
}