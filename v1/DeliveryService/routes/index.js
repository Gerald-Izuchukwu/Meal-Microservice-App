const express = require('express')
const router = express.Router()
const {getPendingOrder, acceptToDeliverOrder, saveOrderToDatabase, deliveryComplete} = require('../controllers/DeliveryContrl')
const {isAuthenticated, isAgent, isAdmin} = require("../isAuthenticated") 


router.route('/getPendingOrder').get(isAuthenticated, isAgent, getPendingOrder)
router.route('/acceptOrder/:id').put(isAuthenticated, isAgent, acceptToDeliverOrder)
router.route('/saveOrder').post(isAuthenticated,  saveOrderToDatabase)
router.route('/deliveryComplete/:id').post(isAuthenticated, isAgent, deliveryComplete)

module.exports = router