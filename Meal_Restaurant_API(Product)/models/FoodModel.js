const mongoose = require('mongoose')
const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true,
    },
    discount: {
        type: Boolean,
        default: false
    }
    //later we can seperate this to contain Dishes and Drinks
},{
    timestamps: true
})

const Food = mongoose.model('Foods', FoodSchema )
module.exports = Food