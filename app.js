require('dotenv').config()
require('./passport-setup')

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000,
    exphbs = require('express-handlebars'),
    cookieSession = require('cookie-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    InstaMojo = require('instamojo-nodejs')


mongoose.connect(process.env.MongoDBURI, () => console.log('db connected'))

InstaMojo.setKeys(process.env.InstaMojoAPIKey,process.env.InstaMojoAuthKey)
InstaMojo.isSandboxMode(false)

app.use(cookieSession({
    maxAge: 2 * 24 * 60 * 60 * 1000,
    keys : [ process.env.SECRET_KEY ] 
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))

app.engine('handlebars', exphbs({defaultLayout : 'layout'}))
app.set('view engine','handlebars')

app.use(flash())

app.use('/', require('./routes/login'))
app.use('/profile',require('./routes/profile'))


app.listen(PORT,(err)=>{
    if(!err) console.log(`server started on port %d`,PORT)
})