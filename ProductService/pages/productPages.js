const {Swallow, SingleFood, Soup, Dish, Drinks, Snacks, Protien} = require('../models/FoodModel')
const axios = require('axios').default


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


module.exports = {
    addFoodPage,
    productsPage
}