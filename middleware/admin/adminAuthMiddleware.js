const isAdmin = async(req,res,next)=>{
    if(req.session.admin){        
       return next();
    }
    else{
        return res.redirect('/zipkart/admin/login')
    }
}

const isLogged = async (req,res,next)=>{
    if(req.session.admin){
        return res.redirect('/zipkart/admin/dashboard')

    }
    else{
        return next();

    }
}

module.exports = {
    isAdmin,
    isLogged
}
