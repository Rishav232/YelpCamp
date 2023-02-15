const mongoose=require("mongoose");
const Review=require("./review")
const Schema=mongoose.Schema;

const imageSchema=new Schema({
        url:String,
        filename:String
})
imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_200")
})
const opts = { toJSON: { virtuals: true } };
const campgroundSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    images:[imageSchema],
    location:String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
        //   required: true
        },
        coordinates: {
          type: [Number],
        //   required: true
        }
      },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
})
campgroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `<a href="campgrounds/${this._id}">${this.title}</a>`
})
campgroundSchema.post("findOneAndDelete",async(doc)=>{
    if(doc.reviews.length)
    {
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports=mongoose.model("Campground",campgroundSchema);