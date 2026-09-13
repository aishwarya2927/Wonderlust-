if(process.env.NODE_ENV != "production"){
   require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const initData = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL || MONGO_URL;
const ExpressError=require("./utils/ExpressError.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.create ? connectMongo : (connectMongo.MongoStore || connectMongo.default);
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currentUser=req.user;
  // console.log(res.locals.success);
  next();
});

// app.get("/demouser", async (req, res, )=>{
//   let fakeUser = new User({
//     email:"student123@gmail.com",
//     username:"Demo-Student"
//   });
//  let registeredUser = await User.register(fakeUser, "HelloPassword");

// // register is a convinient method to register a new user instance with a given password. Checks if a username is unique
// res.send(registeredUser);

// });

// listing
app.use("/listings",listingRouter);

// Reviews
app.use("/listings/:id/reviews",reviewRouter);

//user
app.use("/",userRouter);


app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.error("SERVER ERROR:", err);
  res.status(statusCode).render("error.ejs", { message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});