const campground = require("../models/campground");
const Campground=require("../models/campground");
const {cloudinary}=require("../cloudinary")
const mbxGeometry=require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAPBOX_TOKEN;
const geoCoder=mbxGeometry({accessToken:mapToken})
module.exports.index=async(req,res)=>{

    const camp=await Campground.find({});
   //  console.log(camp)
    res.render("index",{camp});
 }

 module.exports.getNewForm=async(req,res)=>{
 
    res.render("new");
 }
 module.exports.MakeNewCampground=async(req,res,next)=>{
   const geoData=await geoCoder.forwardGeocode({
      query:req.body.campground.location,
      limit:1
   }).send()
    const camp=new Campground(req.body.campground);
   camp.geometry=geoData.body.features[0].geometry;
    camp.author=req.user._id;
    camp.images=req.files.map(f=>({url:f.path,filename:f.filename
    }));
    await camp.save();
   //  console.log(camp);
    req.flash("success","Successfully added a camp");
    res.redirect(`/campground/${camp._id}`);
 }
 module.exports.getEditForm=async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp)
    {
       req.flash("error","Cannot find the campground");
       return res.redirect("/campground");
    }
    console.log(camp.images)
    res.render("edit",{camp});
 }

 module.exports.UpdateCamp=async(req,res)=>{
    const {id}=req.params;
   //  console.log(req.body);
    const camp=await Campground.findByIdAndUpdate(id,req.body.campground);
    const img=req.files.map(f=>({url:f.path,filename:f.filename
    }));
    camp.images.push(...img);
    const geoData=await geoCoder.forwardGeocode({
      query:req.body.campground.location,
      limit:1
   }).send()
    camp.geometry=geoData.body.features[0].geometry;
    await camp.save();
    if(req.body.deleteImages)
    {
      for(let filename of req.body.deleteImages){
         await cloudinary.uploader.destroy(filename);
      }
      await Campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash("success","Successfully updated campground")
    res.redirect(`/campground/${camp._id}`);
 }

 module.exports.deleteCamp=async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndDelete(id);
    req.flash("success","Deleted Campground")
    res.redirect("/campground");
 }
 module.exports.showEachCamp=async(req,res)=>{
 
    const {id}=req.params;
    const camp=await Campground.findById(id).populate({
     path:"reviews",
     populate:{
        path:"author"
     }
  })
    .populate("author");
  //   console.log(camp);
    if(!camp)
    {
       req.flash("error","Cannot find the campground");
       return res.redirect("/campground");
    }
   //  console.log(camp.images);
    res.render("show",{camp});
 }
 