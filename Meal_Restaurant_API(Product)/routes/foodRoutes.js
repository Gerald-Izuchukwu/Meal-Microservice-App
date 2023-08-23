const express = require('express')
const router = express.Router()
const {addFood, getAFood, getFoods, deleteFood} = require('../controllers/FoodContrl')

router.route('/').get(getFoods).post(addFood)
router.route("/:id").get(getAFood).delete(deleteFood)
module.exports = router