//later in v1.2, this schema will be the schema holding all single food and drinks like the one in order schema
// and the Dishes Schema will hold the dishes pieced together

// remember, order model is only for when a user wants to make an order, 
// it in no way saves the food the restaurant has, it only saves the order a user makes

// we would also export every schema so a user can browse a specific thing, either soup, drinks, snacks etc
const mongoose = require('mongoose')

const SoupSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    foodPrice: {
        type: Number,
        default : 0
    }
});

const SwallowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    foodPrice: {
        type: Number,
        default : 0
    }
});

const SnacksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    foodPrice: {
        type: Number,
        default : 0
    }
})

const DrinksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    foodPrice: {
        type: Number,
        default : 0
    }
})

const SingleFoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    foodPrice: {
        type: Number,
        default : 0
    }
})

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