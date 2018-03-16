require('dotenv').config()
const passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth20'),
    User = require('./models/user-model')

passport.serializeUser((user, done) => {
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(err,user)
    })
})

passport.use(
    new GoogleStrategy({
        clientID: process.env.GoogleClientID,
        clientSecret: process.env.GoogleClientSecret,
        callbackURL: "/auth/success"
    }, (accessToken, refreshToken, profile, done) => {

        User.findOne({ googleID: profile.id }).then((err,currentUser) => {
            if(err) return console.log(err)
            if (currentUser) {
                done(null,currentUser)
            }
            else {
                let photos = profile.photos[0],
                    image = photos.value
                new User({
                    username: profile.displayName,
                    googleID: profile.id,
                    profileImage: image
                }).save().then((newUser) => {
                    done(null, newUser)
                })
            }
        })
    })
)