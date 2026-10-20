const express = require('express')
const router = express.Router()
const {getPendingOrder, acceptToDeliverOrder, saveOrderToDatabase, deliveryComplete} = require('../controllers/DeliveryContrl')
const {isAuthenticated, isAgent, isAdmin} = require("../isAuthenticated") 
const ORDER_SERVICE_HOST = process.env.ORDER_SERVICE_HOST || 'localhost';
const ORDER_SERVICE_PORT = process.env.ORDER_SERVICE_PORT || 9600;


router.route('/getPendingOrder').get(isAuthenticated, isAgent, getPendingOrder)
router.route('/acceptOrder/:id').put(isAuthenticated, isAgent, acceptToDeliverOrder)
router.route('/saveOrder').post(isAuthenticated,  saveOrderToDatabase)
router.route('/deliveryComplete/:id').post(isAuthenticated, isAgent, deliveryComplete)

router.get('/getPendingOrder', isAuthenticated, async (req, res) => {
  try {
    const result = await axios.get(`http://${ORDER_SERVICE_HOST}:${ORDER_SERVICE_PORT}/meal-api/v1/order/getPendingOrder`,{
         headers: { Authorization: req.headers.authorization } }
    )
    return res.status(result.status).json(result.data)
  } catch (e) {
    return res.status(e.response?.status || 500).json(e.response?.data || { error: e.message })
  }
})

module.exports = router