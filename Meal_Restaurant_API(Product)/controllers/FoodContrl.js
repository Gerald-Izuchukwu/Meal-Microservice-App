// const Food = require('../models/FoodModel')
const {Soup, Swallow, SingleFood, Snacks, Drinks, Dish, Protien} = require('../models/FoodModel')
const axios = require('axios').default



const addFood = async(req, res)=>{
    try {
        const {name, description, ofType, discount, soupPrice, swallowPrice, drinkPrice, protienPrice, snacksPrice, singleFoodPrice, dishPrice} = req.body
        if(ofType === "Dish"){
            if(!(name, description, dishPrice, ofType)){
                return res.status(400).send('Please enter all required fields')
        
            }
            const newDish = await Dish.create({
                name, description, dishPrice, 
            })
            return res.status(201).json({msg: "Dish Saved", newDish})
        }else if (ofType === "Soup"){
            if(!(name,  soupPrice, ofType)){
                return res.status(400).send('Please enter all required fields')
        
            }
            const newSoup = new Soup({
                name,  soupPrice, 
            })
            const soup = await newSoup.save()
            return res.status(201).json({msg: "Soup Saved", soup})
        }else if (ofType === "Swallow"){
            if(!(name,  swallowPrice, ofType)){
                return res.status(400).send('Please enter all required fields')
        
            }
            const newSwallow = new Swallow({
                name,  swallowPrice, 
            })
            const swallow = await newSwallow.save()
            return res.status(201).json({msg: "Swallow Saved", swallow})
        }else if (ofType === "SingleFood"){
            if(!(name,  singleFoodPrice, ofType)){
                return res.status(400).send('Please enter all required fields')
        
            }
            const newSingleFood = new SingleFood({
                name,  singleFoodPrice, 
            })
            const singleFood = await newSingleFood.save()
            return res.status(201).json({msg: "Food Saved", singleFood})
        }else if (ofType === "Snacks"){
            if(!(name,  snacksPrice, ofType)){
                return res.status(400).send('Please enter all required fields')
        
            }
            const newSnacks = new Snacks({
                name,  snacksPrice, 
            })
            const snacks = await newSnacks.save()
            return res.status(201).json({msg: "Snacks Saved", snacks})
        }else if (ofType === "Protien"){
            if(!(name,  protienPrice, ofType)){
                return res.status(400).send('Please enter all required fields')
        
            }
            const newProtien = new Protien({
                name,  protienPrice, 
            })
            const protien = await newProtien.save()
            return res.status(201).json({msg: "Protien Saved", protien})
        }else if (ofType === "Drink"){
            if(!(name,  drinkPrice, ofType)){
                return res.status(400).send('Please enter all required fields')
        
            }
            const newDrink = new Drinks({
                name,  drinkPrice, 
            })
            const drink = await newDrink.save()
            return res.status(201).json({msg: "Drink Saved", drink})
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }

}

const getFoods = async(req, res)=>{
    try {
        const food = await Food.find()
        if(!food){
            console.log('No food found');
            return res.status(400).send('We couldnt find any food')
        }
        return res.status(200).json({food})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}

// get a particular food
const getAFood = async (req, res)=>{
    try {
        const id = req.params.id
        const food = await Food.findById(id)
        if(!food){
            console.log('Couldnt find that food');
            return res.status(400).send("No food found")
        }
        return res.status(200).json({food})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}
// get my most expensive food
const mostExpensiveFood = async(req, res)=>{
    try {
        // get all food
        // loop through the food
        // get the on with the highest price
        // return that food
        const foods = await Food.find()
        const mostExpensiveFood = foods.reduce((maxFood, currentFood) => {
                if (!maxFood || currentFood.price > maxFood.price) {
                return currentFood;
                } else {
                return maxFood;
                }
            }, 
            null
        )
        return res.status(200).send(mostExpensiveFood)

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}
// update a food, also be used to discount food
const updateFood = async(req, res)=>{
    try {
        const foodId = req.params.id
        const food = await Food.findById(foodId)
        if(!food){
            console.log('No such Food');
            return res.status(400).send("Food doesnt exist")
        }
        const updatedFood = await Food.findByIdAndUpdate(foodId, {$set: req.body}, {new: true})
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
const deleteFood = async(req, res)=>{
    try {
        const id = req.params.id
        const food = await Food.findById(id)
        if(!food){
            console.log('Couldnt find that food');
            return res.status(400).send("No food found")
        }
        await Food.findByIdAndDelete(id)
        return res.status(200).send('Food has been deleted')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}

// const discountFood = async(req, res)=>{
//     try {
//         const foodId = req.params.id
//         const food = Food.findById(foodId)
//         if(!food){
//             console.log('No such Food');
//             return res.status(400).send("Food doesnt exist")
//         }
//         const discountedFood = await Food.findByIdAndUpdate(foodId, {$set: req.body}, {new: true})
//         return res.status(201).json({
//             msg: "Food Updated",
//             Food: discountedFood
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send('Internal Server Error ' + error.message)
//     }

// }

// get all Orders from a user

//update a food (eg, update price)
// discount a food
// discount foods
const getDiscountedFood = async(req, res)=>{
    try {
        const foods = await Food.find()
        // console.log(foods)
        const discountedFood =[] 
        foods.forEach((food)=>{
            if (food.discount === true){
                discountedFood.push(food)
            }
        })
        if(discountedFood.length <=0){
            return res.status(200).send('Sorry No discounted food at the moment')
        }
        return res.status(200).json({discountedFood})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}

// routes for v1.2
// mark order as ready for pickup
// receive order sent 

module.exports = {
    addFood, 
    getAFood, 
    getFoods, 
    mostExpensiveFood, 
    deleteFood, 
    updateFood, 
    getDiscountedFood, 
    mostExpensiveFood
}


// const getDishes = async()=>{
//     try {
//         const food = await Food.find()
//         if(!food){
//             console.log('No food found');
//             return res.status(400).send('We couldnt find any food')
//         }
//         return res.status(200).json({food})
        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send('Internal Server Error ' + error.message)
//     }
// }


// const addFood = async(req, res)=>{
//     try {
//         const {name, description, price} = req.body
//         if(!(name, description, price)){
//             return res.status(400).send('Please enter all required fields')
    
//         }
//         const newFood = new Food({
//             name, description, price, 
//         })
//         const food = await newFood.save()
//         return res.status(201).json({msg: "Food Saved", food})
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send('Internal Server Error ' + error.message)
//     }

// }


// const Joi = require('joi');

// const addFood = async (req, res) => {
//     try {
//         const { error, value } = validateFood(req.body);

//         if (error) {
//             return res.status(400).send(error.details[0].message);
//         }

//         const { name, price, ofType, ...otherFields } = value;

//         const FoodModel = getModelByofType(ofType);

//         const newFood = new FoodModel({
//             name,
//             price,
//             ...otherFields,
//         });

//         const food = await newFood.save();
//         return res.status(201).json({ msg: "Food Saved", food });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).send('Internal Server Error ' + error.message);
//     }
// }

// function validateFood(foodData) {
//     const schema = Joi.object({
//         name: Joi.string().required(),
//         price: Joi.number().required(),
//         ofType: Joi.string().valid('Dish', 'Soup', 'Swallow', 'SingleFood', 'Snacks', 'Protien', 'Drink').required(),
//         // Add other validation rules for specific fields based on the ofType
//     });

//     return schema.validate(foodData);
// }

// function getModelByofType(ofType) {
//     switch (ofType) {
//         case 'Dish':
//             return Dish;
//         case 'Soup':
//             return Soup;
//         case 'Swallow':
//             return Swallow;
//         case 'SingleFood':
//             return SingleFood;
//         case 'Snacks':
//             return Snacks;
//         case 'Protien':
//             return Protien;
//         case 'Drink':
//             return Drink;
//         default:
//             throw new Error('Invalid food ofType');
//     }
// }
