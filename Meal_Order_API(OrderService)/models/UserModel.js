const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const moniker = require('moniker')
const { generateUsername } = require("unique-username-generator");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,

    },
    uniqueUser: {
        type: String,
        required: false,
        default: generateUniqueUser()
    },
    email: {
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}, {
    timestamps: true
})



UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

function generateUniqueUser(){
    const userName = generateUsername("_", 2)
    return userName
}

const User = mongoose.model('User', UserSchema)
module.exports = User