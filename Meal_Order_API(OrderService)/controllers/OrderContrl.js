const Order = require('../models/OrderModel')
const isAuthenticated = require('../isAuthenticated')

const makeOrder = async(req, res)=>{
    try {
        const {takeOut, food, drinks, orderPlacedBy} = req.body
        if(!(takeOut, food, drinks, orderPlacedBy)){
            return res.status(400).send('Please enter all required fields')
    
        }
        const newOrder = new Order({
            takeOut, food, drinks, orderPlacedBy
        })
        const order = await newOrder.save()
        return res.status(201).json({msg: "order Saved", order})
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
        return res.status(200).json({orders})
        
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
// update an order
// completed order route
// delete an order/ cancel an order
//update an order
module.exports = {makeOrder, getOrders, getAnOrder}