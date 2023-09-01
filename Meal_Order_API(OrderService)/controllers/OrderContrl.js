const Order = require('../models/OrderModel')
const rabbitConnect = require('../rabbitConnect')
const axios = require('axios').default


async function createOrder(food) {
    let totalPrice = 0
    for(let t=0; t<food.length; t++){
        totalPrice += food[t].price
    }
    const newOrder = await Order.create({
        food, 
        address : "userAddress", //correct this later to be the main user add
        user: "userEmail", //correct this later to be the main user email
        takeOut: true,
        paymentOnDelivery: false,
        totalPrice: 1000
    })
    return newOrder
}

function switchFood (food, foodToOrder,items, type, name){
    switch (type) {
        case "soup":
            items = Object.values(food.soups)
            foodToOrder = items.filter((food)=>food.name.toLowerCase() === name.toLowerCase())
            break;
        case "swallow":
            items = Object.values(food.swallow)
            foodToOrder = items.filter((food)=>food.name.toLowerCase() === name.toLowerCase())
            break;
        case "snacks":
            items = Object.values(food.snacks)
            foodToOrder = items.filter((food)=>food.name.toLowerCase() === name.toLowerCase())
            break;
        case "dish":
            items = Object.values(food.dish)
            foodToOrder = items.filter((food)=>food.name.toLowerCase() === name.toLowerCase())
            break;
        case "singleFood":
            items = Object.values(food.singleFood)
            foodToOrder = items.filter((food)=>food.name.toLowerCase() === name.toLowerCase())
            break;
        case "drinks":
            items = Object.values(food.drinks)
            foodToOrder = items.filter((food)=>food.name.toLowerCase() === name.toLowerCase())
            break;
        case "protien":
            items = Object.values(food.protien)
            foodToOrder = items.filter((food)=>food.name.toLowerCase() === name.toLowerCase())
            break;
        default:
            break;
    }
}



// place order from already sampled food ----incomplete route
const placeOrder = async(req, res)=>{
    try {
        await rabbitConnect().then((channel)=>{
            channel.consume("ORDER", data=>{
                const {food} = JSON.parse(data.content)
                console.log('Consuming ORDER Queue')
                // console.log(foodToOrder);
                Order.create({
                    food,
                    address : "userAddress", //correct this later to be the main user add
                    user: "userEmail", //correct this later to be the main user email
                    takeOut: true,
                    paymentOnDelivery: false,
                    totalPrice: 1000
                }).then((data)=>{
                    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({data})))
                    console.log(data)
                    return res.status(200).json({data})
                })
                // send it to ORDER queue
                channel.ack(data)
            })
            
            setTimeout(()=>{
                channel.close()
                // return res.status(200).json({foodToOrder})
            }, 2000)
        })
        // const food = await axios.get("http://localhost:9601/meal-api/v1/food/")
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    
    }
}

// get list of food that the restaurant has 
const getFoods = async(req, res)=>{
    try {
        const {type} = req.query
        const allFood = (await axios.get(`http://localhost:9601/meal-api/v1/food/get-food?type=${type}`)).data
        if(!allFood){
            res.status(200).send('There is no already prepared food at the moment')
        }else{
            return res.status(200).json(allFood)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error  ' + error.message)
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
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}
// get a particular order
const getAnOrder = async (req, res)=>{
    try {
        const id = req.params.id
        const order = await Order.findById(id)
        if(!order){
            console.log('Couldnt find that order');
            return res.status(400).send("No orderr found")
        }
        return res.status(200).json({order})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
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
        return res.status(500).send('Internal Server Error ' + error.message)
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
        return res.status(500).send('Internal Server Error ' + error.message)      
    }
}

const deleteAllOrders = async(req, res)=>{
    try {
        await Order.deleteMany()
        return res.status(200).send('All Orders have been deleted')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}


// completed order route - a user should mark an order completed when they receive the order
const receivedOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Find the order by orderId
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order's completed status
        order.completed = true;
        await order.save();
        

        return res.status(200).json({ message: 'Order has been received therefore marked as completed' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error ' + error  });
    }
}



// Routes for V1.2
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
// getFoods()
module.exports = {
    getOrders, 
    getAnOrder,  
    updateOrder, 
    deleteOrder, 
    deleteAllOrders, 
    placeOrder, 
    getFoods, 
    receivedOrder
}