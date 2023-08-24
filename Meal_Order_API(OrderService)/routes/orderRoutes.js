const express = require('express')
const router = express.Router()
const {getOrders, makeOrder, getAnOrder, updateOrder, deleteOrder, deleteAllOrders, placeOrder} = require('../controllers/OrderContrl')
const isAuthenticated = require('../isAuthenticated')


router.route('/' ).post(isAuthenticated,makeOrder).delete(isAuthenticated,deleteAllOrders)
router.get('/', isAuthenticated, getOrders)
router.route('/placeOrder', isAuthenticated).post(placeOrder)
router.route('/:id', isAuthenticated).get(getAnOrder).put(updateOrder).delete(deleteOrder)

module.exports = router