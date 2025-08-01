const express=require("express");
const { route } = require("./listing");
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { reviewSchema}=require("../schema.js");
const Review = require('../models/reviews.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewControllers = require("../controllers/reviews.js");


// post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));


// delete review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync (reviewControllers.destroyReview));

module.exports=router;