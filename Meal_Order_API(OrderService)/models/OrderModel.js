const mongoose = require('mongoose');
const moniker = require('moniker')

const DrinkSchema = new mongoose.Schema({

    drinkType: {
        type: String,
        enum: ["alcohol", "nonalcohol"],
        required: true
    },
    options: {
        alcohol: {
            type: String,
            enum: ["Beer", "Spirit", "Bitters", "Wine"],
            required: function () {
                return this.drinkType === 'alcohol';
            }
        },
        nonalcohol: {
            type: String,
            enum: ['Water', "Tea", "Soda"],
            required: function () {
                return this.drinkType === 'nonalcohol';
            }
        }
    },
    size: {
        type: String,
        enum: ["Big", "Medium", "Small"],
        required: true,
    },
    drinkPrice: {
        type: Number,
        default: 0
    }
});
// const Drink = mongoose.model('Drink', DrinkSchema)

const FoodSchema = new mongoose.Schema({
    foodType: {
        type: String,
        enum: ["singleDish", "soup"]
    },
    singleDish: {
        type: String,
        enum: ['Rice', 'Beans', "Yam"],
    },
    soups: {
        type: String,
        enum: ['Afang', "Edikaikong", "Egwusi", "White", "Eforiro", "Banga", "Bitterleaf", "Ogbono", "Oha", "Okro", "Pepper-Soup"]
    },
    swallow: {
        type: String,
        enum: ["Pounded Yam", "Eba", "Fufu", "Wheat", "Unripped Plantain", "Ripped Plantain", "Semo", "Amala", "Tuwo Shinkafa", "Tuwo Masara"]
    },
    protien: {
        type: String,
        enum: ["Beef", "Fish", "Chicken", "Turkey" ]
    },
    foodPrice: {
        type: Number,
        default : 0
    }
});
// const Food = mongoose.model('Food', FoodSchema)

const OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        default: generateOrderName()

    },
    takeOut: {
        type: Boolean,
        default: false
    },
    food: FoodSchema,
    drinks: DrinkSchema,
    takeOutPrice: {
        type: Number,
        default: function () {
            if (this.takeOut === true) {
                return 10;
            } else {
                return 0;
            }
        }
    },
    paymentOnDelivery: {
        type: String,
        default: false

    },
    completed: {
        type: Boolean,
        default: false
    },
    totalPrice : {
        type: Number,
        default: 0
    },
    orderPlacedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
}, 
{   timestamps: true
});



const drinkPriceMapping = {
    alcohol: {
        Big: 10,
        Medium: 8,
        Small: 6,
    },
    nonalcohol: {
        Big: 5,
        Medium: 4,
        Small: 3,
    },
};

DrinkSchema.pre('save', function (next) {
    const priceConfig = drinkPriceMapping[this.drinkType];
    if (priceConfig && priceConfig[this.size]) {
        this.drinkPrice = priceConfig[this.size];
    } else {
        this.drinkPrice = 0; // Default price when no specific configuration matches
    }
    next();
});

const priceMapping = {
    singleDish: {
        Rice: { Beef: 2000, Chicken: 2500, Turkey: 3500, Fish: 2000 },
        Beans: { Beef: 2000, Chicken: 2000, Turkey: 3000, Fish: 2000 },
        Yam: { Beef: 1500, Chicken: 1800, Turkey: 2000, Fish: 1500 }
    },
    soup: {
        Afang: { Beef: 3000, Chicken: 4000, Turkey: 4000, Fish: 3000 },
        Edikaikong: { Beef: 3000, Chicken: 4000, Turkey: 4000, Fish: 3000 },
        Egwusi: { Beef: 4000, Chicken: 4500, Turkey: 4500, Fish: 4000 }
    }
};

const cheapSoups = ["White", "Eforiro", "Banga", "Bitterleaf", "Ogbono", "Oha", "Okro", "Pepper-Soup"]


FoodSchema.pre('save', function(next){
    if (this.foodType==="soup" && cheapSoups.includes(this.soups)){
        console.log('yes');
        if(this.protien ){
            this.foodPrice = 3000
        }
    }else{
        console.log('no');
        const priceConfig = priceMapping[this.foodType][this.singleDish || this.soups];
        if (priceConfig) {
            this.foodPrice = priceConfig[this.protien] || 0;
        }
    }
    next()
})



OrderSchema.pre('save', async function(next) {
    try {
        const foodPopulatedOrder = await this.populate('food')
        const food = foodPopulatedOrder.food;
        const drinkPopulatedOrder = await this.populate('drinks')
        const drink = drinkPopulatedOrder.drinks;

        // Calculate the foodPrice and drinkPrice
        let foodPrice, drinkPrice;

        if (food) {
            foodPrice = food.foodPrice;
        } else {
            foodPrice = 0;
        }
        
        if (drink) {
            drinkPrice = drink.drinkPrice;
        } else {
            drinkPrice = 0;
        }

        // Calculate the totalPrice based on takeOut value
        if (this.takeOut === true) {
            this.totalPrice = foodPrice + drinkPrice + 10;
        } else {
            this.totalPrice = foodPrice + drinkPrice;
        }

        next();
    } catch (error) {
        next(error);
    }
});


OrderSchema.pre('updateOne', async function(next) {
    try {
        const order = await this.model.findOne(this.getQuery());
        const foodPopulatedOrder = await order.populate('food').execPopulate();
        const food = foodPopulatedOrder.food;
        const drinkPopulatedOrder = await order.populate('drinks').execPopulate();
        const drink = drinkPopulatedOrder.drinks;

        // Calculate the old foodPrice and drinkPrice
        let oldFoodPrice = 0;
        let oldDrinkPrice = 0;

        if (food) {
            oldFoodPrice = food.foodPrice;
        }
        
        if (drink) {
            oldDrinkPrice = drink.drinkPrice;
        }

        // Calculate the new foodPrice and drinkPrice based on the update
        let newFoodPrice = oldFoodPrice;
        let newDrinkPrice = oldDrinkPrice;

        if (this.getUpdate().$set.food) {
            newFoodPrice = this.getUpdate().$set.food.foodPrice;
        }
        
        if (this.getUpdate().$set.drinks) {
            newDrinkPrice = this.getUpdate().$set.drinks.drinkPrice;
        }

        // Calculate the totalPrice based on takeOut value
        if (this.getUpdate().$set.takeOut === true) {
            this.getUpdate().$set.totalPrice = newFoodPrice + newDrinkPrice + 10;
        } else {
            this.getUpdate().$set.totalPrice = newFoodPrice + newDrinkPrice;
        }

        next();
    } catch (error) {
        next(error);
    }
});




function generateOrderName(){
    const customMoniker = moniker.generator([moniker.adjective, moniker.noun]);
    return customMoniker.choose()
}




const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;


// Define a static method to generate the order name
// OrderSchema.statics.generateOrderName = function() {
//     return `Order-${Date.now()}`;
// };

// // Create a virtual 'name' field that gets its value from the generateOrderName static method
// OrderSchema.virtual('name').get(function () {
//     return this.constructor.generateOrderName();
// });//if you want to entirely get rid of the name name and generate it virtually

