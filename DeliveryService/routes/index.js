const express = require('express')
const router = express.Router()
const {getPendingOrder, acceptToDeliverOrder, deliverOrder, deliveryComplete} = require('../controllers/DeliveryContrl')
const {isAuthenticated, isAgent, isAdmin} = require("../isAuthenticated") 


router.route('/getPendingOrder').get(isAuthenticated, isAgent, getPendingOrder)
router.route('/acceptOrder/:id').put(isAuthenticated, isAgent, acceptToDeliverOrder)
router.route('/deliverOrder').post(isAuthenticated, isAgent,  deliverOrder)
router.route('/deliveryComplete/:id').post(isAuthenticated, isAgent, deliveryComplete)

module.exports = router