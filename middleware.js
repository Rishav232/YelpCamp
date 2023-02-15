const {campgroundSchema,reviewSchema}=require("./SchemasJOI");
const ExpressError=require("./utils/ExpressError") 
const Campground=require("./models/campground");
const Review=require("./models/review")


module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash("error","You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateError=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(err=>err.message).join(",");
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
module.exports.isAuthor=async (req,res,next)=>{
   const {id}=req.params;
   const camp=await Campground.findById(id);
   if(!camp.author.equals(req.user._id)){
      req.flash("error","You don't have permission to do that");
      res.redirect(`/campground/${id}`);
   }
   next();

}
module.exports.isreviewAuthor=async (req,res,next)=>{
    const {id,reviewID}=req.params;
    const review=await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)){
       req.flash("error","You don't have permission to do that");
       return res.redirect(`/campground/${id}`);
    }
    next();
 
 }
module.exports.reviewValidate=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(err=>err.message).join(",");
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}