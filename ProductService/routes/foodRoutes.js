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
    mostExpensiveFood,
} = require('../controllers/FoodContrl')
const {isAdmin, isAuthenticated} = require('../isAuthenticated')

router.route('/buy-food').post(isAuthenticated, buyFood)
router.route('/get-food').get( getFood)
// router.route('/home-page').get(productsPage)
router.route('/get-food-type').get( getFoodBasedOnType)
router.route('/add-food').post(isAuthenticated, isAdmin, addFood)
router.route('/discountedFoods').get(getDiscountedFood)
router.route('/mostExpensiveFood').get(mostExpensiveFood)
router.route("/add-to-cart/:id").post(addToCart)
router.route("/:id").get(isAuthenticated, getAFood).delete(isAuthenticated, isAdmin, deleteFood).put(isAuthenticated,isAdmin,updateFood)

module.exports = router


// // router.route('/buy-food').post(isAuthenticated, buyFood)
// router.route('/get-food').get( getFood)
// router.route('/home-page').get(productsPage)
// router.route('/get-food-type').get( getFoodBasedOnType)
// // router.route('/add-food').post(isAuthenticated, addFood)
// router.route('/add-food').post(upload, addFood).get(addFoodPage)
// router.route('/discountedFoods').get(getDiscountedFood)
// router.route('/mostExpensiveFood').get(mostExpensiveFood)
// router.route("/add-to-cart/:id").get(addToCartPage).post(addToCart)
// // router.route("/:id").get(isAuthenticated, getAFood).delete(isAuthenticated, isAdmin, deleteFood).put(isAuthenticated,isAdmin,updateFood)
// // router.route("/:id").get( getAFood).delete( deleteFood).put(updateFood)
// router.route("/edit/:id").get(editFoodPage).put(updateFood)
// // router.route("/delete/:id").get(deleteFoodPage).post(deleteFood)
// router.route("/delete/:id").get(deleteFoodPage).delete(deleteFood)
// module.exports = router