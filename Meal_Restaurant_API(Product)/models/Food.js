const mongoose = require('mongoose')
const FoodsSchema = new mongoose.Schema({
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
})

const Food = mongoose.model('Foods', )