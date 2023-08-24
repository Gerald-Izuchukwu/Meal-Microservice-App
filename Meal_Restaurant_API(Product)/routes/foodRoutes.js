const express = require('express')
const router = express.Router()
const {addFood, getAFood, getFoods, deleteFood, updateFood} = require('../controllers/FoodContrl')

router.route('/').get(getFoods).post(addFood)
router.route("/:id").get(getAFood).delete(deleteFood).put(updateFood)
module.exports = router