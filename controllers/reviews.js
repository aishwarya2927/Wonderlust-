
const Listing = require("../models/listing.js");
const Review = require('../models/reviews.js');

module.exports.createReview = async (req,res)=>{
  console.log(req.params.id); 
  let listing=await Listing.findById(req.params.id);
   const { rating, comment } = req.body.review;
   let newReview = new Review({ rating, comment });
   newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview._id);
    console.log(listing._id);
    await newReview.save();
    await listing.save();
    // console.log("Full req.body:", req.body);
 req.flash("success", "New Review created");
    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
    
}

module.exports.destroyReview = async(req,res)=>{
  let{id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
 req.flash("success", "Review Deleted");
 res.redirect(`/listings/${id}`);
}