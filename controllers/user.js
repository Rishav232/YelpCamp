const User=require("../models/user")
module.exports.getRegisterform=(req,res)=>{
    res.render("users/register")
}
module.exports.createUser=async(req,res,next)=>{
    try{ 
    const {username,password,email}=req.body;
    const user=new User({username,email});
    const registerUser=await User.register(user,password);
    req.login(registerUser,err=>{
        if(err) return next(err);

        req.flash("success","Welcome to YelpCamp")
        res.redirect("/campground");

    })
    
    }
    catch(e){
        req.flash("error","Username is already registered")
        res.redirect("/register")
    }

}
module.exports.getLoginform=(req,res)=>{
    // console.log(req.session.returnTo)
    res.render("users/login")
}

module.exports.login=(req,res)=>{
    req.flash("success","Welcome Back");
    const redirectUrl=req.session.returnTo || "/campground";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout(function(err) {
        if (err) { 
          return next(err); 
          }
          req.flash("success","Succesfully Logged Out");
          res.redirect("/campground")
      });
    
 }