const express = require('express')
const router = express.Router()
const {getOrders, makeOrder} = require('../controllers/OrderContrl')

router.route('/').get(getOrders).post(makeOrder)

module.exports = router