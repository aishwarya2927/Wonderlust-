const User = require('../models/user');

// signup
module.exports.renderSignup = (req,res)=>{
    res.render("Users/signup.ejs");
}

module.exports.signupUser = async (req,res)=>
{
try
{
 let {username , email , password}=req.body;
 const newUser = new User({email , username});
 const registeredUser = await User.register(newUser , password);

 // login
 req.login(registeredUser, (err)=>{
    if(err){
        return next(err);
    }  
 req.flash("success", "Welcome to wanderlust");
 res.redirect("/listings");
 })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin =  (req,res)=>{
    res.render("Users/login.ejs");
}

module.exports.loginUser =  async(req,res)=>{

       req.flash("success",` Wanderlust welcomes you ${req.body.username} !!`);
       let redirectUrl = res.locals.redirectUrl || "/listings";
       res.redirect(redirectUrl);
    }

// logout
module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return next(err);
        }
        req.flash("success", "You are logged out!!");
        res.redirect("/listings");
    })
}    