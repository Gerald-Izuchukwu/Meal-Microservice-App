//later in v1.2, this schema will be the schema holding all single food and drinks like the one in order schema
// and the Dishes Schema will hold the dishes pieced together

// remember, order model is only for when a user wants to make an order, 
// it in no way saves the food the restaurant has, it only saves the order a user makes

// we would also export every schema so a user can browse a specific thing, either soup, drinks, snacks etc
const mongoose = require('mongoose')

const SoupSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Afang', "Edikaikong", "Egwusi", "White", "Eforiro", "Banga", "Bitterleaf", "Ogbono", "Oha", "Okro", "Pepper-Soup"]
    },
    ofType: {
        type: String,
        enum : ["Soup"]
    },

    soupPrice: {
        type: Number,
        default : 0
    }
},{
    timestamps: true
});

const SwallowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["Pounded Yam", "Eba", "Fufu", "Wheat", "Unripped Plantain", "Ripped Plantain", "Semo", "Amala", "Tuwo Shinkafa", "Tuwo Masara"]

    },

    ofType: {
        type: String,
        enum : ["Swallow"]
    },
    swallowPrice: {
        type: Number,
        default : 0
    }
},{
    timestamps: true
});

const SnacksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["Meshai", "Shawarma", "Fruit-Salad", "Small-Chops"]
    },
    ofType: {
        type: String,
        enum : ["Snacks"]
    },

    snacksPrice: {
        type: Number,
        default : 0
    }
},{
    timestamps: true
})

const DrinksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        // enum: []
    },

    ofType: {
        type: String,
        enum : ["Drink"]
    },

    drinkPrice: {
        type: Number,
        default : 0
    }
},{
    timestamps: true
})

const SingleFoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Rice', 'Beans', "Yam"]
    },

    ofType: {
        type: String,
        enum : ["SingleFood"]
    },

    singleFoodPrice: {
        type: Number,
        default : 0
    }
},{
    timestamps: true
})

const ProtienSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["Beef", "Fish", "Chicken", "Turkey" ]
    },

    ofType: {
        type: String,
        enum : ["Protien"]
    },

    protienPrice: {
        type: Number,
        default : 0
    }
},{
    timestamps: true
})

const DishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    ofType: {
        type: String,
        enum : ["Dish"]
    },
    description:{
        type: String,
        required: true,
        unique: true
    },
    dishPrice:{
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


const Soup = mongoose.model('Soups', SoupSchema )
const Swallow = mongoose.model('Swallow', SwallowSchema )
const Snacks = mongoose.model('Snacks', SnacksSchema )
const Drinks = mongoose.model('Drinks', DrinksSchema )
const Dish = mongoose.model('Dishes', DishSchema )
const SingleFood = mongoose.model('SingleFood', SingleFoodSchema )
const Protien = mongoose.model('Protiens', ProtienSchema)
module.exports = {Soup, Swallow, Snacks, Drinks, Dish, SingleFood, Protien}