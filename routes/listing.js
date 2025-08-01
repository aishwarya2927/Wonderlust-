
const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema , reviewSchema}=require("../schema.js");
const initData = require("../init/data.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const controllers = require("../controllers/listings.js");

// parsing image
const multer = require("multer");
const {storage}= require("../cloudconfig.js");
const upload = multer({ storage });

// create route
router
.route("/")
     .get(wrapAsync(controllers.index))
     .post(
      isLoggedIn, 
      upload.single('listing[image]'),
      validateListing,
      wrapAsync(controllers.createListing));


//New Route
router.get("/new", isLoggedIn, controllers.renderNewForm );

//Show, update and delete Route
router
.route("/:id")
  .get(wrapAsync(controllers.showListing))
  .put(isLoggedIn,isOwner, upload.single('listing[image]'), validateListing, wrapAsync(controllers.updateListing))
  .delete(isLoggedIn , isOwner, wrapAsync(controllers.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner , wrapAsync(controllers.editListing));

module.exports=router;