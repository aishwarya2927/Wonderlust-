const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")

// signup
router
  .route("/signup")
   .get(userController.renderSignup)
   .post(WrapAsync(userController.signupUser));


// login
router
.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl, 
    passport.authenticate('local', {
        failureRedirect : "/login",
        failureFlash:true }), 
        userController.loginUser
       );


// logout
router.get("/logout",userController.logoutUser)

module.exports = router;