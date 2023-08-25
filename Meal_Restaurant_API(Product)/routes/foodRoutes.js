const express = require('express')
const router = express.Router()
const {
    addFood, 
    getAFood, 
    getFoods, 
    deleteFood, 
    updateFood, 
    getDiscountedFood,
    mostExpensiveFood
} = require('../controllers/FoodContrl')

router.route('/get-food').get(getFoods).post(addFood)
router.route('/add-food').post(addFood)
router.route('/discountedFoods').get(getDiscountedFood)
router.route('/mostExpensiveFood').get(mostExpensiveFood)
router.route("/:id").get(getAFood).delete(deleteFood).put(updateFood)
module.exports = router