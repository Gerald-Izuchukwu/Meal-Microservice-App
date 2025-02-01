// const Food = require('../models/FoodModel')
const fs = require('fs')
const {Soup, Swallow, SingleFood, Snacks, Drinks, Dish, Protien, Food, Cart} = require('../models/FoodModel')
const rabbitConnect = require('../rabbitConnect')
const axios = require('axios').default

const buyFood =async(req, res)=>{
    try {
        const {ids} = req.body;
        const createdOrderArray = []
        const soup = await Soup.find({_id: {$in: ids}})
        const swallow = await Swallow.find({_id: {$in: ids}})
        const snacks = await Snacks.find({_id: {$in: ids}})
        const singleFood = await SingleFood.find({_id: {$in: ids}})
        const protien = await Protien.find({_id: {$in: ids}})
        const dish = await Dish.find({_id: {$in: ids}})
        const drinks = await Drinks.find({_id: {$in: ids}})
        const food = [
            ...soup, 
            ...swallow,
            ...snacks,
            ...singleFood,
            ...protien,
            ...dish,
            ...drinks,
        ]
        const dataToSend = {food, timestamp: Date.now()}
        // res.json(food)
        await rabbitConnect().then((channel)=>{
            channel.sendToQueue("ORDER", Buffer.from(JSON.stringify({dataToSend})))//later we add userEmail from req.user.email
            console.log("sending food to ORDER queue")
            return
        }).then(()=>{
            
            // axios.post("http://orderservice:9600/meal-api/v1/order/placeOrder", {user: req.user.email}).catch((err)=>{console.log(err.message);})
            axios.post(`http://${process.env.ORDER_SERVICE_HOST}:${process.env.ORDER_SERVICE_PORT}/meal-api/v1/order/placeOrder`, 
                { user: req.user.email },  
                { 
                  headers: { 
                    Authorization: req.headers.authorization  
                  }
                }
            ).catch((err)=>{console.log(err.message);})
        })

        rabbitConnect().then((channel)=>{
            channel.consume("PRODUCT", (data)=>{
                console.log("consuming PRODUCT Queue")
                const createdOrder =  JSON.parse(data.content)
                createdOrderArray.push(createdOrder)
                console.log(JSON.parse(data.content));
                channel.ack(data)
            })
            setTimeout(()=>{
                channel.close()
                return res.status(200).json(createdOrderArray[0])

            }, 2000)
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }

}

const addFood = async(req, res)=>{
    try {
        const {name, description, type, discount,  price} = req.body
        console.log(req.body);

        if(type === "Dish"){
            if(!(name, description, price, type)){
                return res.status(400).send('Please enter all required fields')
            }else{
                const newDish = await Dish.create({
                    name, description, price, discount
                })
                res.status(201).json({
                    status: "Success",
                    message: "Food Created Successfully",
                    food: newDish
                })
            }
        }else if (type === "Soup"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
            }else{
                const newSoup = new Soup({
                    name,  price, type
                })
                const soup = await newSoup.save()
                res.status(201).json({
                    status: "Success",
                    message: "Food Created Successfully",
                    food: newSoup
                })
            }
        }else if (type === "Swallow"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
        
            }else{
                const newSwallow = new Swallow({
                    name,  price, type
                })
                const swallow = await newSwallow.save()
                res.status(201).json({
                    status: "Success",
                    message: "Food Created Successfully",
                    food: newSwallow
                })
            }
        }else if (type === "SingleFood"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')

            } else{
                const newSingleFood = new SingleFood({
                    name,  price, type
                })
                const singleFood = await newSingleFood.save()
                res.status(201).json({
                    status: "Success",
                    message: "Food Created Successfully",
                    food: newSingleFood
                })
            }
        }else if (type === "Snacks"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
        
            }else{
                const newSnacks = new Snacks({
                    name,  price, type
                })
                const snacks = await newSnacks.save()
                res.status(201).json({
                    status: "Success",
                    message: "Food Created Successfully",
                    food: newSnacks
                })
            }
        }else if (type === "Protien"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
        
            }else{
                const newProtien = new Protien({
                    name,  price, type
                })
                const protien = await newProtien.save()
                res.status(201).json({
                    status: "Success",
                    message: "Food Created Successfully",
                    food: newProtien
                })
            }
        }else if (type === "Drink"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
            }else{
                const newDrink = new Drinks({
                    name,  price, type
                })
                const drink = await newDrink.save()
                res.status(201).json({
                    status: "Success",
                    message: "Food Created Successfully",
                    food: newDrink
                })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }

}

const addToCart = async(req, res)=>{
    try {
        const user_id = req.user
        const {ids} = req.body
        if(!ids){
            return res.send('No items to add to Cart')
        }else{
            const newCart = new Cart({"name": user_id, ids})
            console.log(newCart);
            console.log(req.user)
            
            fs.writeFileSync("./test.txt", JSON.stringify(req.headers, null, 2))
            const cart = await newCart.save()
            return res.send("item added to cart")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)  
    }
}

const getFood = async(req, res)=>{
    try {
        const soups = await Soup.find()
        const swallow = await Swallow.find()
        const snacks = await Snacks.find()
        const singleFood = await SingleFood.find()
        const protien = await Protien.find()
        const dish = await Dish.find()
        const drinks = await Drinks.find()
        const food = [
            {
                "soups": {...soups}, 
                "swallow": {...swallow} ,
                "singleFood": {...singleFood},
                "snacks": {...snacks},
                "drinks": {...drinks},
                "dish": {...dish},
                "protiens": {...protien}
            }
        ]
        return res.status(200).json({food})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}

const getFoodBasedOnType = async (req, res) => {
    try {
        const { type } = req.query;
        const formatedType = type.toLowerCase()

        if (!type) {
            return res.status(400).send('Please provide a valid food type');
        }

        let foods;

        switch (formatedType) {
            case 'soup':
                foods = await Soup.find();
                break;
            case 'snacks':
                foods = await Snacks.find();
                break;
            case 'swallow':
                foods = await Swallow.find();
                break;
            case 'singlefood':
                foods = await SingleFood.find();
                break;
            case 'protien':
                foods = await Protien.find();
                break;
            case 'dish':
                foods = await Dish.find();
                break;
            case 'drinks':
                foods = await Drinks.find();
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        if (!foods || foods.length === 0) {
            console.log(`No ${type} found`);
            return res.status(400).send(`We couldn't find any ${type}`);
        }

        return res.status(200).json({ [type] : foods });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message);
    }
}

// get a particular food
const getAFood = async (req, res) => {
    try {

        const { id } = req.params;
        const {type} = req.query
        let foodModel;

        switch (type) {
            case 'Soup':
                foodModel = Soup;
                break;
            case 'Snacks':
                foodModel = Snacks;
                break;
            case 'Swallow':
                foodModel = Swallow;
                break;
            case 'SingleFood':
                foodModel = SingleFood;
                break;
            case 'Protien':
                foodModel = Protien;
                break;
            case 'Dish':
                foodModel = Dish;
                break;
            case 'Drinks':
                foodModel = Drinks;
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        const food = await foodModel.findById(id);

        if (!food) {
            console.log(`Couldn't find that ${type}`);
            return res.status(400).send(`No ${type} found`);
        }

        return res.status(200).json({ food });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message);
    }
};

// update a food, also be used to discount food
const updateFood = async(req, res)=>{
    try {
        // const type = req.body.type
        const {id} = req.params
        const {type} = req.query
        let food
        let foodModel;

        switch (type.toLowerCase()) {
            case 'soup':
                food = await Soup.findById(id);
                foodModel = Soup
                break;
            case 'snacks':
                food = await Snacks.findById(id);
                foodModel= Snacks
                break;
            case 'swallow':
                food = await Swallow.findById(id);
                foodModel = Swallow
                break;
            case 'singlefood':
                food = await SingleFood.findById(id);
                foodModel = SingleFood
                break;
            case 'protien':
                food = await Protien.findById(id);
                foodModel = Protien
                break;
            case 'dish':
                food = await Dish.findById(id);
                foodModel = Dish
                break;
            case 'drinks':
                food = await Drinks.findById(id);
                foodModel = Drinks
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        
        if(!food){
            console.log('No such Food');
            return res.status(400).send("Food doesnt exist")
        }
        const updatedFood = await foodModel.findByIdAndUpdate(id, {$set: req.body}, {new: true})
        return res.status(201).json({
            msg: "Food Updated",
            Food: updatedFood
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}
// delete this food
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const {type} = req.query
        let foodModel;

        switch (type) {
            case 'Soup':
                foodModel = Soup;
                break;
            case 'Snacks':
                foodModel = Snacks;
                break;
            case 'Swallow':
                foodModel = Swallow;
                break;
            case 'SingleFood':
                foodModel = SingleFood;
                break;
            case 'Protien':
                foodModel = Protien;
                break;
            case 'Dish':
                foodModel = Dish;
                break;
            case 'Drinks':
                foodModel = Drinks;
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        const food = await foodModel.findByIdAndDelete(id);

        if (!food) {
            console.log(`Couldn't find that ${type}`);
            return res.status(400).send(`No ${type} found`);
        }

        return res.status(200).json({ food });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message);
    }
};


// discount foods
const getDiscountedFood = async (req, res) => {
    try {
        const { type } = req.query;
        const formatedType = type.toLowerCase()
        let foodModel;

        switch (formatedType) {
            case 'soup':
                foodModel = Soup;
                break;
            case 'snacks':
                foodModel = Snacks;
                break;
            case 'swallow':
                foodModel = Swallow;
                break;
            case 'singlefood':
                foodModel = SingleFood;
                break;
            case 'protien':
                foodModel = Protien;
                break;
            case 'dish':
                foodModel = Dish;
                break;
            case 'drinks':
                foodModel = Drinks;
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        const foods = await foodModel.find();
        const discountedFood = foods.filter(food => food.discount === true);

        if (discountedFood.length <= 0) {
            return res.status(200).send(`Sorry, no discounted ${type} at the moment`);
        }

        return res.status(200).json({ discountedFood });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message);
    }
};

module.exports = {
    addFood, 
    getAFood, 
    buyFood,
    getFood,
    addToCart,
    getFoodBasedOnType, 
    deleteFood, 
    updateFood, 
    getDiscountedFood, 
}

// routes for v1.2
// mark order as ready for pickup
// receive order sent 
//update a food (eg, update price)
// discount a food
// get all Orders from a user
// get my most expensive food
// const mostExpensiveFood = async(req, res)=>{
//     try {
//         // get all food
//         // loop through the food
//         // get the on with the highest price
//         // return that food
//         const {type} = req.query
//         let foods;
//         let price;
//         switch (type) {
//             case "soups":
//                 foods = await Soup.find()
//                 price = foods.soupPrice
//                 break;
//             case "snacks":
//                 foods = await Snacks.find()
//                 break;
//             case "swallow":
//                 foods = await Swallow.find()
//                 break;
//             case "singleFood":
//                 foods = await SingleFood.find()
//                 break;
//             case "protien":
//                 foods = await Protien.find()
//                 break;
//             case "drinks":
//                 foods = await Drinks.find()
//                 break;
//             case "dish":
//                 foods = await Dish.find()
//                 break;
//             default:
//                 break;
//         }
//         const mostExpensiveFood = foods.reduce((maxFood, currentFood) => {
//                 if (!maxFood || currentFood.price > maxFood.price) {
//                 return currentFood;
//                 } else {
//                 return maxFood;
//                 }
//             }, 
//             null
//         )
//         return res.status(200).send(mostExpensiveFood)

//     } catch (error) {
//         console.log(error);
//         return res.status(500).send('Internal Server Error ' + error.message)
//     }
// }


// ---


// // get my most expensive food
// const mostExpensiveFood = async(req, res)=>{
//     try {
//         // get all food
//         // loop through the food
//         // get the on with the highest price
//         // return that food
//         const {type} = req.body
//         let food;
//         let price;
//         switch (type) {
//             case "Soup":
//                 food = await Soup.find()
//                 price = food.price
//                 break;
//             case "Snacks":
//                 food = await Snacks.find()
//                 break;
//             case "Swallow":
//                 food = await Swallow.find()
//                 break;
//             case "SingleFood":
//                 food = await SingleFood.find()
//                 break;
//             case "Protien":
//                 food = await Protien.find()
//                 break;
//             case "Drinks":
//                 food = await Drinks.find()
//                 break;
//             case "Dish":
//                 food = await Dish.find()
//                 break;
//             default:
//                 break;
//         }
//         const mostExpensiveFood = food.reduce((maxFood, currentFood) => {
//             if (!maxFood || currentFood.price > maxFood.price) {
//                 return currentFood;
//             } else {
//                 return maxFood;
//             }

//         }, null)
//         if(!mostExpensiveFood){
//             return res.send("NO food at the moment")
//         }
//         return res.status(200).send(mostExpensiveFood)

//     } catch (error) {
//         console.log(error);
//         // return res.status(500).send('Internal Server Error ' + error.message)
//         return res.status(500).send('Internal Server Error ' + "Try later")
//     }
// }