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
    sendFoodToQueue
} = require('../controllers/FoodContrl')

router.route('/buy-food').post(buyFood)
router.route('/get-food').get(getFood)
router.route('/get-food-type').get(getFoodBasedOnType)
router.route('/add-food').post(addFood)
router.route('/sendfoodtoqueue').post(sendFoodToQueue)
router.route('/discountedFoods').get(getDiscountedFood)
router.route('/mostExpensiveFood').get(mostExpensiveFood)
router.route("/:id").get(getAFood).delete(deleteFood).put(updateFood)
module.exports = router