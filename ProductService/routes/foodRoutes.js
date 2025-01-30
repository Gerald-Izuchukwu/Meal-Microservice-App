const express = require('express')
const router = express.Router()
const {
    addFood, 
    getAFood, 
    getFood, 
    buyFood,
    addToCart,
    getFoodBasedOnType,
    deleteFood, 
    updateFood, 
    getDiscountedFood,
} = require('../controllers/FoodContrl')
const {isAdmin, isAuthenticated} = require('../isAuthenticated')

router.route('/buy-food').post(isAuthenticated, buyFood)
router.route('/get-food').get( getFood)
router.route('/get-food-type').get( getFoodBasedOnType)
router.route('/add-food').post(isAuthenticated, isAdmin, addFood)
router.route('/discountedFoods').get(getDiscountedFood)
router.route("/add-to-cart/:id").post(addToCart)
router.route("/:id").get(isAuthenticated, getAFood).delete(isAuthenticated, isAdmin, deleteFood).put(isAuthenticated,isAdmin,updateFood)
module.exports = router
