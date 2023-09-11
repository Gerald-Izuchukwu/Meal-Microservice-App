const express = require('express')
const router = express.Router()
const {
    addFood, 
    getAFood, 
    getFood, 
    buyFood,
    getFoodBasedOnType,
    deleteFood, 
    updateFood, 
    getDiscountedFood,
    mostExpensiveFood,
} = require('../controllers/FoodContrl')
const isAuthenticated = require('../isAuthenticated')


router.route('/buy-food').post(isAuthenticated, buyFood)
router.route('/get-food').get(isAuthenticated, getFood)
router.route('/get-food-type').get(isAuthenticated, getFoodBasedOnType)
router.route('/add-food').post(isAuthenticated, addFood)
// router.route('/sendfoodtoqueue').post(sendFoodToQueue)
router.route('/discountedFoods').get(isAuthenticated,getDiscountedFood)
router.route('/mostExpensiveFood').get(isAuthenticated,mostExpensiveFood)
router.route("/:id").get(isAuthenticated, getAFood).delete(isAuthenticated, deleteFood).put(isAuthenticated,updateFood)
module.exports = router