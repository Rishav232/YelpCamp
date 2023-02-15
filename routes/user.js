const express=require("express");
const passport = require("passport");
const routes=express.Router();
const User=require("../models/user");
const catchAsync=require("../utils/catchAsync")
const userController=require("../controllers/user")

routes.route("/register")
.get(userController.getRegisterform)
.post(catchAsync(userController.createUser))

routes.route("/login")
.get(userController.getLoginform)
.post(passport.authenticate("local",{failureFlash:true,failureRedirect:"/login",keepSessionInfo: true}),
userController.login)

routes.get("/logout",userController.logout)

module.exports=routes;