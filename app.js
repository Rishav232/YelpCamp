if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const path=require("path");
const mongoose=require("mongoose");

const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session")
const flash=require("connect-flash");
const ExpressError=require("./utils/ExpressError")  

const campgroundRoutes=require("./routes/campground");
const reviewsRoutes=require("./routes/reviews");
const userRoutes=require("./routes/user");
const User=require("./models/user");
const passport=require("passport");
const localStrategy=require("passport-local");
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require("helmet");
const MongoStore = require('connect-mongo');
// "mongodb://127.0.0.1/yelpcamp"
// const db_url=process.env.DB_URL;
const db_url=process.env.DB_URL||"mongodb://127.0.0.1/yelpcamp";
mongoose.set('strictQuery', true);
mongoose.connect(db_url)
.then(()=>{
    console.log("Connected to Mongoose");
})
.catch((err)=>{
    console.log("Error")
    console.log(err);
})

const app=express();
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate)
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))
app.use(mongoSanitize());
app.use(flash())

const store=new MongoStore({
    mongoUrl:db_url,
    secret:"thisismysecret",
    touchAfter:24*60*60
})
store.on("error",function(e){
    console.log("Error",e);
})
const secret=process.env.SECRET||"thisismysecret";
const sessionConfig={
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000
        
    }
}

app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(helmet({contentSecurityPolicy:false}));
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.tiles.mapbox.com",
//     "https://api.mapbox.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.mapbox.com",
//     "https://api.tiles.mapbox.com",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
//     "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com",
//     "https://*.tiles.mapbox.com",
//     "https://events.mapbox.com",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             childSrc: ["blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/dxabrui5i/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );

app.use((req,res,next)=>{
    // console.log(req.query);
    res.locals.currUser=req.user;
    // console.log("USER",req.user);
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.get("/",(req,res)=>{    
    res.render("home")
})
app.use("/",userRoutes);
app.use("/campground",campgroundRoutes);
app.use("/campground/:id/reviews",reviewsRoutes);


 app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not Found",404))
 })
 app.use((err,req,res,next)=>{
    const{statusCode=500}=err;
    if(!err.message)err.message="Something Went Wrong"
    res.status(statusCode).render("error",{err});
 })

 
app.listen(3000,(req,res)=>
{
    console.log("Listening")
}) 