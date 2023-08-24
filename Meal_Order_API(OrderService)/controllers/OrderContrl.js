const Order = require('../models/OrderModel')
const axios = require('axios').default
const isAuthenticated = require('../isAuthenticated')

// make an order from scratch
const makeOrder = async(req, res)=>{
    try {
        const {takeOut, food, drinks, paymentOnDelivery} = req.body
        if(!(takeOut, food, drinks,paymentOnDelivery)){
            return res.status(400).send('Please enter all required fields')
    
        }
        const newOrder = new Order({
            takeOut, food, drinks, paymentOnDelivery
        })
        const order = await newOrder.save()
        return res.status(201).json({msg: "order Saved", order})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error' + error.message)
    }

}


// place order from already sampled food ----incomplete route
const placeOrder = async(req, res)=>{
    try {
        const allFood = (await axios.get("http://localhost:9601/meal-api/v1/food/")).data
        if(!allFood){
            res.status(200).send('There is no already prepared food at the moment, please consider making an order instead of placing one')
        }else{
            const foodIds = allFood.food.map((food)=>food._id)
            console.log(foodIds);
            return res.status(200).json(allFood)
        }
        const food = await axios.get("http://localhost:9601/meal-api/v1/food/")
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error' + error.message)
    
    }
}

const getOrders = async(req, res)=>{
    try {
        const orders = await Order.find()
        if(!orders){
            console.log('No orders found');
            return res.status(400).send('We couldnt find any order')
        }
        return res.status(200).json({count: orders.length, orders})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error' + error.message)
    }
}
// get a particular order
const getAnOrder = async (req, res)=>{
    try {
        const id = req.params.id
        const order = await Order.findById(id)
        if(!order){
            console.log('Couldnt find that order');
            return res.status(400).send("No order found")
        }
        return res.status(200).json({order})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error' + error.message)
    }
}


// update an order
const updateOrder = async(req, res)=>{
    try {
        const orderId = req.params.id
        const order = await Order.findById(orderId)
        if(!order){
            console.log('No such order');
            return res.status(400).send("Order doesnt exist")
        }
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {$set: req.body}, {new: true})
        return res.status(201).json({
            msg: "Order Updated",
            Order: updatedOrder
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error' + error.message)
    }
}

// delete an order/ cancel an order
const deleteOrder = async(req, res)=>{
    try {
        const id = req.params.id
        const order = await Order.findById(id)
        if(!order){
            console.log('Couldnt find that order');
            return res.status(400).send("No order found")
        }
        await Order.findByIdAndDelete(id)
        return res.status(200).send('Order has been deleted')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error' + error.message)      
    }
}

const deleteAllOrders = async(req, res)=>{
    try {
        await Order.deleteMany()
        return res.status(200).send('All Orders have been deleted')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error' + error.message)
    }
}
// get my most expensive order
const sortOrder = async(req, res)=>{
    try {
        const orders = await Order.find()

    } catch (error) {
        
    }
}
// get my orders from previous months
// get my order from a particular restuarant
// get a list of all restaurants, the food and their rating

// completed order route
module.exports = {makeOrder, getOrders, getAnOrder, updateOrder, deleteOrder, deleteAllOrders, placeOrder}