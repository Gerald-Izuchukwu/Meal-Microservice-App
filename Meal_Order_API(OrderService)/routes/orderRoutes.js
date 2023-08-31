const express = require('express')
const router = express.Router()
const {
    getOrders, 
    getAnOrder, 
    updateOrder, 
    deleteOrder, 
    deleteAllOrders, 
    placeOrder, 
    getFoods,
    receivedOrder
} = require('../controllers/OrderContrl')
const isAuthenticated = require('../isAuthenticated')

router.route('/allFood').get(isAuthenticated, getFoods)
router.route('/myOrders').get( isAuthenticated, getOrders).delete(isAuthenticated, deleteAllOrders)
router.route('/placeOrder' ).get(placeOrder)
router.route('/receivedOrder').post(isAuthenticated, receivedOrder)
router.route('/myOrders/:id' ).get(isAuthenticated,getAnOrder).put(isAuthenticated,updateOrder).delete(isAuthenticated,deleteOrder)

module.exports = router