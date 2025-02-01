
const User = require('../../model/user_model')


//get users
const view_users = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .sort({ createdAt: -1 }) // latest first
            .skip(skip)
            .limit(limit);
             
            

            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / limit);

        res.render('admin/usersView', {
            users,
            message:null,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            limit,
            skip,
        });
    }
    catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}

//search User
const search_user = async(req,res)=>{
    try{
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;
        const skip = (page - 1) * limit;
        const searchData = req.query.searchInput;
        console.log(searchData);
        

        let users ;
        let totalUsers;

        if(searchData){
            users = await User.find({ //regex upayogichittan letter by letter search nadakkunnathu pinne options i upayogichaan case sensitivity oyivaakkunnathu sensitive aavan ath oyivakiyaal mathi.
                $or: [
                    { firstName: { $regex: searchData, $options: 'i' } },
                    { lastName: { $regex: searchData, $options: 'i' } }
                ]
            })
            .skip(skip)
            .sort({ createdAt: -1 }) 
            .limit(limit);

            totalUsers = await User.countDocuments({ 
                $or: [
                    { firstName: { $regex: searchData, $options: 'i' } },
                    { lastName: { $regex: searchData, $options: 'i' } }
                ]
            })
        }
        else{
            users = await User.find()
                        .skip(skip)
                        .limit(limit);
            
            totalUsers = await User.countDocuments();
        }
        const totalPages = Math.ceil(totalUsers / limit);
        
        res.render('admin/usersView', {
            users,
            message: users.length > 0 ? null : "No user found",
            currentPage: page,
            skip,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            limit
        });

    
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
    search_user
}