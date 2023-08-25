// const Food = require('../models/FoodModel')
const Food = require('../models/FoodModel')
const axios = require('axios').default

const addFood = async(req, res)=>{
    try {
        const {name, description, price} = req.body
        if(!(name, description, price)){
            return res.status(400).send('Please enter all required fields')
    
        }
        const newFood = new Food({
            name, description, price, 
        })
        const food = await newFood.save()
        return res.status(201).json({msg: "Food Saved", food})
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