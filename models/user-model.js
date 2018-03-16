const mongoose = require('mongoose'),
    Schema = mongoose.Schema

let UserSchema = new Schema({
    username: String,
    googleID: String,
    profileImage: String
})

const user = module.exports = mongoose.model('user', UserSchema)
