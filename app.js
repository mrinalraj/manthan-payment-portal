require('dotenv').config()
require('./passport-setup')

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000,
    exphbs = require('express-handlebars'),
    cookieSession = require('cookie-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    mongoose = require('mongoose')


mongoose.connect(process.env.MongoDBURI, () => console.log('db connected'))

app.use(cookieSession({
    maxAge: 2 * 24 * 60 * 60 * 1000,
    keys : [ process.env.SECRET_KEY ] 
}))

app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', exphbs({defaultLayout : 'layout'}))
app.set('view engine','handlebars')

app.use(flash())

app.use('/', require('./routes/login'))
app.use('/profile',require('./routes/profile'))


app.listen(PORT,(err)=>{
    if(!err) console.log(`server started on port %d`,PORT)
})