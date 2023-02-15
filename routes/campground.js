const express=require("express");
const routes=express.Router();
const catchAsync=require("../utils/catchAsync");
const Campground=require("../models/campground");
const campgroundModel=require("../controllers/campgrounds");
const {isLoggedin,validateError,isAuthor}=require("../middleware");
const multer  = require('multer')
const {storage}=require("../cloudinary")
const upload = multer({ storage })
routes.route("/")
.get(catchAsync(campgroundModel.index))
.post(isLoggedin,upload.array("image"),validateError,catchAsync(campgroundModel.MakeNewCampground))

routes.get("/new",isLoggedin,catchAsync(campgroundModel.getNewForm))

routes.route("/:id")
 .get(catchAsync(campgroundModel.showEachCamp))
 .delete(isLoggedin,isAuthor,catchAsync(campgroundModel.deleteCamp))
 .put(isLoggedin,upload.array("image"), validateError,catchAsync(campgroundModel.UpdateCamp))

routes.get("/:id/edit",isLoggedin,isAuthor,catchAsync(campgroundModel.getEditForm))

module.exports=routes;