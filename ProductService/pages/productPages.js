const {Swallow, SingleFood, Soup, Dish, Drinks, Snacks, Protien} = require('../models/FoodModel')

const addFoodPage = function(req, res){
    res.render('add-food', {title: "Add Food",})
}

const productsPage = async function(req, res){
    const singleFood = await SingleFood.find()
    const soups = await Soup.find()
    const swallow = await Swallow.find()
    const snacks = await Snacks.find()
    const dish = await Dish.find()
    const protien = await Protien.find()
    const drinks = await Drinks.find()
    const food = [...soups, ...swallow, ...singleFood, ...snacks, ...drinks, ...dish, ...protien]
    res.render('index', {title: "ProductsPage", food})
}

const editFoodPage = async function (req, res) {
    console.log(req.params.id)
    const singleFood = await SingleFood.findById(req.params.id)
    const soups = await Soup.findById(req.params.id)
    const swallow = await Swallow.findById(req.params.id)
    const snacks = await Snacks.findById(req.params.id)
    const dish = await Dish.findById(req.params.id)
    const protien = await Protien.findById(req.params.id)
    const drinks = await Drinks.findById(req.params.id)
    const food = [soups, swallow, singleFood, snacks, drinks, dish, protien]
    const renderedFood = food.filter((foodItem)=>{
        return foodItem !== null
    })
    console.log(renderedFood[0])
    res.render('edit_food', {title: "Edit Food", food:renderedFood[0]})
}

const deleteFoodPage = async function (req, res) {
    const singleFood = await SingleFood.findById(req.params.id)
    const soups = await Soup.findById(req.params.id)
    const swallow = await Swallow.findById(req.params.id)
    const snacks = await Snacks.findById(req.params.id)
    const dish = await Dish.findById(req.params.id)
    const protien = await Protien.findById(req.params.id)
    const drinks = await Drinks.findById(req.params.id)
    const food = [soups, swallow, singleFood, snacks, drinks, dish, protien]
    const renderedFood = food.filter((foodItem)=>{
        return foodItem !== null
    })
    // console.log(renderedFood[0])
    res.render('delete_food', {title: "Delete Food", food: renderedFood[0]})
}

const addToCartPage = async function(req, res){
    const singleFood = await SingleFood.findById(req.params.id)
    const soups = await Soup.findById(req.params.id)
    const swallow = await Swallow.findById(req.params.id)
    const snacks = await Snacks.findById(req.params.id)
    const dish = await Dish.findById(req.params.id)
    const protien = await Protien.findById(req.params.id)
    const drinks = await Drinks.findById(req.params.id)
    const food = [soups, swallow, singleFood, snacks, drinks, dish, protien]
    const renderedFood = food.filter((foodItem)=>{
        return foodItem !== null
    })
    console.log(renderedFood)
    res.render('add-food-to-cart', {title: "Add Food to Cart", food: renderedFood[0]})
}
module.exports = {
    addFoodPage,
    productsPage,
    editFoodPage,
    deleteFoodPage, 
    addToCartPage
}