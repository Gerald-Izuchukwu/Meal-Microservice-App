const express = require('express')
const router = express.Router()
const {
    getOrders, 
    makeOrder, 
    getAnOrder, 
    updateOrder, 
    deleteOrder, 
    deleteAllOrders, 
    placeOrder, 
    getFoods,
    getDiscountedFood,
    receivedOrder
} = require('../controllers/OrderContrl')
const isAuthenticated = require('../isAuthenticated')

router.route('/allFood').get(isAuthenticated, getFoods)
router.route('/myOrders').get( isAuthenticated, getOrders).delete(isAuthenticated, deleteAllOrders)
router.route('/makeOrder' ).post(isAuthenticated,makeOrder)
router.route('/placeOrder' ).post(isAuthenticated,placeOrder)
router.route('/receivedOrder').post(isAuthenticated, receivedOrder)
router.route('/discountedFood').get(isAuthenticated, getDiscountedFood)
router.route('/myOrders/:id' ).get(isAuthenticated,getAnOrder).put(isAuthenticated,updateOrder).delete(isAuthenticated,deleteOrder)

module.exports = router