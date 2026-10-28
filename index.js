require("dotenv").config();
const User = require("./models/userModel"); // make sure this import exists at the top of the file
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();
const port = 3000;
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {   // a function needs to be async to use await and viceversa

    try {
        const user = await User.findOneAndUpdate(          // userModel our only model required and created at the top of the file in "User"
            { email: profile.emails[0].value },
            { email: profile.emails[0].value, name: profile.displayName },
            { upsert: true, new: true }
        );

        return done(null, user);                            //passing the real User document, so req.user has role/email/name/_id

    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

//passport.deserializeUser((user, done) => done(null, user));


app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => res.redirect("/")
);

app.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
});



app.get("/api/me", (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({
            loggedIn: true,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role
        });
    }
    res.json({ loggedIn: false });
});

//getting the connection to the database:
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running! ${port}`)
        });
    })
    .catch((err)=>{
        console.error("Failed to connect to MongoDB",err);
    });
