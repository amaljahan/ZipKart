
//get dashboard
const get_dashboard = async(req,res)=>{
    try{
        res.render('admin/adminDashboard')
    }
    catch(err){
        console.log("Error: ",err); 
        res.status(500).json({message:"server error"})
    }
}

module.exports = {
    get_dashboard,
}