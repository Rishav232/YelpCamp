const mongoose=require("mongoose");
const Campground=require("../models/campground");
const cities=require("./cities");
const {descriptors,places}=require("./seedhelpers");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1/yelpcamp")
.then(()=>{
    console.log("Connected to Mongoose");
})
.catch((err)=>{
    console.log("Error")
    console.log(err);
})
const sample=(arr)=>arr[Math.floor(Math.random()*arr.length)];
const seedSchema=async ()=>{

    await Campground.deleteMany({});
    
    for(let i=0;i<200;i++)
    {
        const priceR=Math.floor(Math.random()*20)+10;
        const random1000=Math.floor(Math.random()*1000);
        const camp=new Campground({
            author:"63d6525bc5c78fefb126f491",
            location:`${cities[random1000].city} , ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [ 
              cities[random1000].longitude,
              cities[random1000].latitude
             ] },
            images:[
                {
                  url: 'https://res.cloudinary.com/dxabrui5i/image/upload/v1675240051/YelpCamp/gti2auuk0x12cf4tb6gq.webp',
                  filename: 'YelpCamp/tgqwohn2hrkelayrbmtw'
                },
                {
                  url: 'https://res.cloudinary.com/dxabrui5i/image/upload/v1675239684/YelpCamp/vmssgpro6l5fwdtrqbeq.jpg',
                  filename: 'YelpCamp/thldg6pxyqnsrc8d4g7f'
                }
              ],
            price:priceR,
            description:"Velit aliquip in ullamco incididunt ad. Commodo sit id tempor officia. Ea qui anim fugiat irure aliqua. In commodo dolor cillum veniam aute Lorem."
        })
        camp.save();
    }
}

seedSchema();