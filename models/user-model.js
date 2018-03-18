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
    email : String,
    accomodation : Boolean,
    events : [String],
    payment : Boolean,
    paymentId : String,
    paymentReq : String,
    kuruInfo : {
        teamLeader : String,
        teamName : String,
        game : String,
        members : [String],
        steamIds : [String],
        manthanIds : [String]
    },
    qr : String
})

const user = module.exports = mongoose.model('user', UserSchema)
