const mongoose = require('mongoose')
const DishSchema = new mongoose.Schema({
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

// const Dish = mongoose.model('Dishes', DishSchema )
// module.exports = Dish