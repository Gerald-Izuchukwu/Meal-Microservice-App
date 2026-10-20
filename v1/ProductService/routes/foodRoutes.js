const express = require('express')
const router = express.Router()
const axios = require('axios').default
const ORDER_SERVICE_HOST = process.env.ORDER_SERVICE_HOST || 'localhost';
const ORDER_SERVICE_PORT = process.env.ORDER_SERVICE_PORT || 9600;

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
} = require('../controllers/FoodContrl')
const {isAdmin, isAuthenticated} = require('../isAuthenticated')

router.route('/myOrders').get(isAuthenticated, async (req, res) => {
    try {
        const response = await axios.get(`http://${ORDER_SERVICE_HOST}:${ORDER_SERVICE_PORT}/meal-api/v1/order/myOrders`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        return res.json(response.data).status(response.status);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching orders' });
    }
});

router.get('/getPendingOrder', isAuthenticated, async (req, res) => {
  try {
    const result = await axios.get(
      `${ORDER_SERVICE_HOST}:${ORDER_SERVICE_PORT}/meal-api/v1/order/getPendingOrder`,
      { headers: { Authorization: req.headers.authorization } }
    )
    return res.status(result.status).json(result.data)
  } catch (e) {
    return res.status(e.response?.status || 500).json(e.response?.data || { error: e.message })
  }
})

router.get('/myOrders/:id', isAuthenticated, async (req, res) => {
  try {
    const result = await axios.get(`http://${ORDER_SERVICE_HOST}:${ORDER_SERVICE_PORT}/meal-api/v1/order/myOrders/${req.params.id}`,{
         headers: { Authorization: req.headers.authorization } }
    )
    return res.status(result.status).json(result.data)
  } catch (e) {
    return res.status(e.response?.status || 500).json(e.response?.data || { error: e.message })
  }
})

router.post('/receivedOrder/:id', isAuthenticated, async (req, res) => {
  try {
    const result = await axios.get(`http://${ORDER_SERVICE_HOST}:${ORDER_SERVICE_PORT}/meal-api/v1/order/receivedOrder/${req.params.id}`,{
         headers: { Authorization: req.headers.authorization } }
    )
    return res.status(result.status).json(result.data)
  } catch (e) {
    return res.status(e.response?.status || 500).json(e.response?.data || { error: e.message })
  }
})


router.route('/buy-food').post(isAuthenticated, buyFood)
router.route('/get-food').get( getFood)
router.route('/get-food-type').get( getFoodBasedOnType)
router.route('/add-food').post(isAuthenticated, isAdmin, addFood)
router.route('/discountedFoods').get(getDiscountedFood)
router.route("/add-to-cart").post(addToCart)
router.route("/:id").get(isAuthenticated, getAFood).delete(isAuthenticated, isAdmin, deleteFood).put(isAuthenticated,isAdmin,updateFood)

module.exports = router