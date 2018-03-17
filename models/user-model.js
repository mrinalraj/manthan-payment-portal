const mongoose = require('mongoose'),
    Schema = mongoose.Schema

let UserSchema = new Schema({
    username: String,
    googleID: String,
    profileImage: String,
    basicInfo: Boolean,
    college:String,
    city : String,
    branch : String,
    year : String,
    mobile : String,
    accomodation : Boolean,
    events : [String],
    payment : Boolean,
    paymentToken : String
})

const user = module.exports = mongoose.model('user', UserSchema)
