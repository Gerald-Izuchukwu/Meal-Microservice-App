const Order = require('../models/OrderModel')
const rabbitConnect = require('../rabbitConnect')
const axios = require('axios').default




// place order from already sampled food ----incomplete route
const placeOrder = async(req, res)=>{
    try {
        await rabbitConnect().then((channel)=>{
            channel.consume("ORDER", data=>{
                const {food} = JSON.parse(data.content)
                const user = req.body.user
                console.log('Consuming ORDER Queue')
                let totalPrice = 0
                for(let i=0; i<food.length; i++){
                    totalPrice += food[i].price
                }
                Order.create({
                    food,
                    address : "userAddress", //correct this later to be the main user add
                    user, //correct this later to be the main user email
                    takeOut: true,
                    paymentOnDelivery: false,
                    totalPrice
                }).then((data)=>{ 
                    console.log('Sending to PRODUCT Queue');
                    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({data})))
                    // console.log(req.user.email)
                    // return res.status(200).json({data})
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


const getOrders = async(req, res)=>{
    try {
        const email = req.user.email
        const orders = await Order.find({user: email})
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
            return res.status(400).send("No order found")
        }
        if(order.user !== req.user.email){
            console.log('Order doesnt belong to the user');
            return res.status(400).send("No order found")            
        }
        return res.status(200).json({order})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}


// update an order - this route is just to showcase development skill, normally orders should not be edited after they are 
// made, they can only be cancelled
const updateOrder = async(req, res)=>{
    try {
        const orderId = req.params.id
        const order = await Order.findById(orderId)
        if(!order){
            console.log('No such order');
            return res.status(400).send("Order doesnt exist")
        }
        if(order.user !== req.user.email){
            console.log('Order doesnt belong to the user');
            return res.status(400).send("No order found")            
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
        if(order.user !== req.user.email){
            console.log('Order doesnt belong to the user');
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
        await Order.deleteMany({user:req.user.email})
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

module.exports = {
    getOrders, 
    getAnOrder,  
    updateOrder, 
    deleteOrder, 
    deleteAllOrders, 
    placeOrder, 
    receivedOrder
}

// Routes for V1.2
// get my most expensive order
// const sortOrder = async(req, res)=>{

//     try {
//         const orders = await Order.find()

//     } catch (error) {
        
//     }
// }
// get my orders from previous months
// get my order from a particular restuarant
// get a list of all restaurants, the food and their rating
// completed order route
// getFoods()

// //I will find a way to call this function in the placeOrder
// async function createOrder(food) {
//     let totalPrice = 0
//     for(let t=0; t<food.length; t++){
//         totalPrice += food[t].price
//     }
//     const newOrder = await Order.create({
//         food, 
//         address : "userAddress", //correct this later to be the main user add
//         user: req.user.email,
//         takeOut: true,
//         paymentOnDelivery: false,
//         totalPrice: 1000
//     })
//     return newOrder
// }