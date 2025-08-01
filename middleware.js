const Listing = require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review = require("./models/reviews.js");

// Validation middleware for listing
module.exports.validateListing = (req,res,next)=>{
  let {error}=listingSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}


// Validation middleware for review
module.exports.validateReview = (req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map(el=>el.message).join(", ");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}


module.exports.isLoggedIn = (req,res,next)=>
{
    console.log(req.user);
if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
 req.flash("error","You must be logged in to create listings.");
 return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let{id}=req.params;
      let listing = await Listing.findById(id);
     const { currentUser } = res.locals;
  if(currentUser && !listing.owner._id.equals(currentUser._id)){
    req.flash("error","You dont have the permission to edit");
   return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let{id, reviewId}=req.params;
      let review = await Review.findById(reviewId);
    
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error","You are not the author of this review");
   return res.redirect(`/listings/${id}`);
  }
  next();
}
