const express=require("express")
const routes=express.Router({mergeParams:true})
const catchAsync=require("../utils/catchAsync");
const Campground=require("../models/campground");
const Review=require("../models/review");
const {reviewSchema}=require("../SchemasJOI");
const {reviewValidate,isLoggedin,isreviewAuthor}=require("../middleware");
const reviewController=require("../controllers/reviews");

routes.post("/",isLoggedin,reviewValidate ,catchAsync(reviewController.createReview))

 routes.delete("/:reviewID",isLoggedin,isreviewAuthor,catchAsync(reviewController.deleteReview))

 module.exports=routes;