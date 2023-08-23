// const Food = require('../models/FoodModel')
const Food = require('../models/FoodModel')
const isAuthenticated = require('../isAuthenticated')

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
        return res.status(500).send('Internal Server Error' + error.message)
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
        return res.status(500).send('Internal Server Error' + error.message)
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
        return res.status(500).send('Internal Server Error' + error.message)
    }
}
// get my most expensive food
const mostExpensiveFood = async(req, res)=>{
    try {
        const foods = await Food.find()

    } catch (error) {
        
    }
}
// update a food
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
        
    }
}
//update a food (eg, update price)
// discount a food
// discount foods
module.exports = {addFood, getAFood, getFoods, mostExpensiveFood, deleteFood}