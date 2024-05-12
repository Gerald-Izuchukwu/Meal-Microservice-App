// const Food = require('../models/FoodModel')
const fs = require('fs')
const {Soup, Swallow, SingleFood, Snacks, Drinks, Dish, Protien, Food, Cart} = require('../models/FoodModel')
const rabbitConnect = require('../rabbitConnect')
const axios = require('axios').default

const multer = require('multer')

// image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname)
        
    }
})

const upload = multer({
    storage: storage
}).single('image')

const buyFood =async(req, res)=>{
    try {
        const {ids} = req.body;
        const createdOrderArray = []
        const soup = await Soup.find({_id: {$in: ids}})
        const swallow = await Swallow.find({_id: {$in: ids}})
        const snacks = await Snacks.find({_id: {$in: ids}})
        const singleFood = await SingleFood.find({_id: {$in: ids}})
        const protien = await Protien.find({_id: {$in: ids}})
        const dish = await Dish.find({_id: {$in: ids}})
        const drinks = await Drinks.find({_id: {$in: ids}})
        const food = [
            ...soup, 
            ...swallow,
            ...snacks,
            ...singleFood,
            ...protien,
            ...dish,
            ...drinks,
        ]
        const dataToSend = {food, timestamp: Date.now()}
        // res.json(food)
        await rabbitConnect().then((channel)=>{
            channel.sendToQueue("ORDER", Buffer.from(JSON.stringify({dataToSend})))//later we add userEmail from req.user.email
            console.log("sending food to ORDER queue")
            return
        }).then(()=>{
            // axios.post("http://orderservice:9600/meal-api/v1/order/placeOrder", {user: req.user.email}).catch((err)=>{console.log(err.message);})
            axios.post("http://localhost:9600/meal-api/v1/order/placeOrder", {user: req.user.email}).catch((err)=>{console.log(err.message);})
        })

        rabbitConnect().then((channel)=>{
            channel.consume("PRODUCT", (data)=>{
                console.log("consuming PRODUCT Queue")
                const createdOrder =  JSON.parse(data.content)
                createdOrderArray.push(createdOrder)
                console.log(JSON.parse(data.content));
                channel.ack(data)
            })
            setTimeout(()=>{
                channel.close()
                return res.status(200).json(createdOrderArray[0])

            }, 2000)
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }

}

const addFood = async(req, res)=>{
    try {
        console.log('1')
        const {name, description, type, discount,  price} = req.body
        console.log(req.body);
        const image = req.file.filename
        console.log('11')

        if(type === "Dish"){
            if(!(name, description, price, type, image)){
                return res.status(400).send('Please enter all required fields')
        
            }
            const newDish = await Dish.create({
                name, description, price, discount, image
            })
            res.session.message = {
                type: "success",
                message: "Food added"
            }
            res.redirect('http://localhost:9601/meal-api/v1/food/')
            // return res.status(201).json({msg: "Dish Saved", newDish})
        }else if (type === "Soup"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
        
            }else{
                const newSoup = new Soup({
                    name,  price, image, type
                })
                const soup = await newSoup.save()
                req.session.message = {
                    type: "success",
                    message: "Food added"
                }
                res.redirect('http://localhost:9601/meal-api/v1/food/home-page')
            }
            // return res.status(201).json({msg: "Soup Saved", soup})
        }else if (type === "Swallow"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
        
            }else{
                const newSwallow = new Swallow({
                    name,  price, image, type
                })
                const swallow = await newSwallow.save()
                req.session.message = {
                    type: "success",
                    message: "Food added"
                }
                res.redirect('http://localhost:9601/meal-api/v1/food/home-page')
            }
            // return res.status(201).json({msg: "Swallow Saved", swallow})
        }else if (type === "SingleFood"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
        
            } else{
                const newSingleFood = new SingleFood({
                    name,  price, image, type
                })
                const singleFood = await newSingleFood.save()
                req.session.message = {
                    type: "success",
                    message: "Food added"
                }
                res.redirect('http://localhost:9601/meal-api/v1/food/home-page')

            }
            // return res.status(201).json({msg: "Food Saved", singleFood})
        }else if (type === "Snack"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
        
            }else{
                const newSnacks = new Snacks({
                    name,  price, image, type
                })
                const snacks = await newSnacks.save()
                req.session.message = {
                    type: "success",
                    message: "Food added"
                }
                res.redirect('http://localhost:9601/meal-api/v1/food/home-page')
            }

            res.session.message = {
                type: "success",
                message: "Food added"
            }
            res.redirect('http://localhost:9601/meal-api/v1/food/')
            // return res.status(201).json({msg: "Snacks Saved", snacks})
        }else if (type === "Protien"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
        
            }else{
                const newProtien = new Protien({
                    name,  price, image, type
                })
                const protien = await newProtien.save()
                req.session.message = {
                    type: "success",
                    message: "Food added"
                }
                res.redirect('http://localhost:9601/meal-api/v1/food/home-page')
            }
            // return res.status(201).json({msg: "Protien Saved", protien})
        }else if (type === "Drink"){
            if(!(name,  price, type)){
                return res.status(400).send('Please enter all required fields')
            }else{
                const newDrink = new Drinks({
                    name,  price, image, type
                })
                const drink = await newDrink.save()
                req.session.message = {
                    type: "success",
                    message: "Drink added"
                }
                res.redirect('http://localhost:9601/meal-api/v1/food/home-page')
            }
            // return res.status(201).json({msg: "Drink Saved", drink})
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }

}

const addToCart = async(req, res)=>{
    try {
        const user_id = req.user
        const ids = req.body.ids
        if(!ids){
            return res.send('No items to add to Cart')
        }else{
            const newCart = new Cart({user_id, ids})
            const cart = await newCart.save()
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)  
    }
}

const getFood = async(req, res)=>{
    try {
        const soups = await Soup.find()
        const swallow = await Swallow.find()
        const snacks = await Snacks.find()
        const singleFood = await SingleFood.find()
        const protien = await Protien.find()
        const dish = await Dish.find()
        const drinks = await Drinks.find()
        const food = [
            {
                "soups": {...soups}, 
                "swallow": {...swallow} ,
                "singleFood": {...singleFood},
                "snacks": {...snacks},
                "drinks": {...drinks},
                "dish": {...dish},
                "protiens": {...protien}
            }
        ]
        return res.status(200).json({food})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}

const getFoodBasedOnType = async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).send('Please provide a valid food type');
        }

        let foods;

        switch (type) {
            case 'soups':
                foods = await Soup.find();
                break;
            case 'snacks':
                foods = await Snacks.find();
                break;
            case 'swallow':
                foods = await Swallow.find();
                break;
            case 'singleFood':
                foods = await SingleFood.find();
                break;
            case 'protien':
                foods = await Protien.find();
                break;
            case 'dish':
                foods = await Dish.find();
                break;
            case 'drinks':
                foods = await Drinks.find();
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        if (!foods || foods.length === 0) {
            console.log(`No ${type} found`);
            return res.status(400).send(`We couldn't find any ${type}`);
        }

        return res.status(200).json({ [type] : foods });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message);
    }
}

// get a particular food
const getAFood = async (req, res) => {
    try {
        const { type, id } = req.params;
        let foodModel;

        switch (type) {
            case 'soups':
                foodModel = Soup;
                break;
            case 'snacks':
                foodModel = Snacks;
                break;
            case 'swallow':
                foodModel = Swallow;
                break;
            case 'singleFood':
                foodModel = SingleFood;
                break;
            case 'protien':
                foodModel = Protien;
                break;
            case 'dish':
                foodModel = Dish;
                break;
            case 'drinks':
                foodModel = Drinks;
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        const food = await foodModel.findById(id);

        if (!food) {
            console.log(`Couldn't find that ${type}`);
            return res.status(400).send(`No ${type} found`);
        }

        return res.status(200).json({ food });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message);
    }
};

// update a food, also be used to discount food
const updateFood = async(req, res)=>{
    try {
        const foodId = req.params.id
        // const {type} = req.query
        const type = req.body.type
        let food
        let foodModel;
        // console.log(req.body)
        // console.log(req.params.id)

        switch (type) {
            case 'soups':
                food = await Soup.findById(foodId);
                foodModel = Soup
                break;
            case 'snacks':
                food = await Snacks.findById(foodId);
                foodModel= Snacks
                break;
            case 'swallow':
                food = await Swallow.findById(foodId);
                foodModel = Swallow
                break;
            case 'singleFood':
                food = await SingleFood.findById(foodId);
                foodModel = SingleFood
                break;
            case 'protien':
                food = await Protien.findById(foodId);
                foodModel = Protien
                break;
            case 'dish':
                food = await Dish.findById(foodId);
                foodModel = Dish
                break;
            case 'drinks':
                food = await Drinks.findById(foodId);
                foodModel = Drinks
                break;
            default:
                return res.status(400).send('Invalid food type');
        }
        if(!food){
            console.log('No such Food');
            return res.status(400).send("Food doesnt exist")
        }
        const updatedFood = await foodModel.findByIdAndUpdate(foodId, {$set: req.body}, {new: true})
        return res.status(201).json({
            msg: "Food Updated",
            Food: updatedFood
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message)
    }
}
// delete this food
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const type= req.body.type
        let foodModel;

        switch (type) {
            case 'soups':
                foodModel = Soup;
                break;
            case 'snacks':
                foodModel = Snacks;
                break;
            case 'swallow':
                foodModel = Swallow;
                break;
            case 'singleFood':
                foodModel = SingleFood;
                break;
            case 'protien':
                foodModel = Protien;
                break;
            case 'dish':
                foodModel = Dish;
                break;
            case 'drinks':
                foodModel = Drinks;
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        const food = await foodModel.findByIdAndDelete(id);

        if (!food) {
            console.log(`Couldn't find that ${type}`);
            return res.status(400).send(`No ${type} found`);
        }
        if(food.image != ''){
            fs.unlinkSync('./uploads/'+ food.image)
        }
        req.session.message = {
            type: "success",
            message: "Food Deleted"
        }
        res.redirect('http://localhost:9601/meal-api/v1/food/home-page')

        // return res.status(200).json({ food });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message);
    }
};

// get my most expensive food
const mostExpensiveFood = async(req, res)=>{
    try {
        // get all food
        // loop through the food
        // get the on with the highest price
        // return that food
        const {type} = req.query
        let foods;
        let price;
        switch (type) {
            case "soups":
                foods = await Soup.find()
                price = foods.soupPrice
                break;
            case "snacks":
                foods = await Snacks.find()
                break;
            case "swallow":
                foods = await Swallow.find()
                break;
            case "singleFood":
                foods = await SingleFood.find()
                break;
            case "protien":
                foods = await Protien.find()
                break;
            case "drinks":
                foods = await Drinks.find()
                break;
            case "dish":
                foods = await Dish.find()
                break;
            default:
                break;
        }
        const mostExpensiveFood = foods.reduce((maxFood, currentFood) => {
            if (!maxFood || currentFood.price > maxFood.price) {
                return currentFood;
            } else {
                return maxFood;
            }

        }, null)
        if(!mostExpensiveFood){
            return res.send("NO food at the moment")
        }
        return res.status(200).send(mostExpensiveFood)

    } catch (error) {
        console.log(error);
        // return res.status(500).send('Internal Server Error ' + error.message)
        return res.status(500).send('Internal Server Error ' + "Try later")
    }
}

// discount foods
const getDiscountedFood = async (req, res) => {
    try {
        const { type } = req.params;
        let foodModel;

        switch (type) {
            case 'soups':
                foodModel = Soup;
                break;
            case 'snacks':
                foodModel = Snacks;
                break;
            case 'swallow':
                foodModel = Swallow;
                break;
            case 'singleFood':
                foodModel = SingleFood;
                break;
            case 'protien':
                foodModel = Protien;
                break;
            case 'dish':
                foodModel = Dish;
                break;
            case 'drinks':
                foodModel = Drinks;
                break;
            default:
                return res.status(400).send('Invalid food type');
        }

        const foods = await foodModel.find();
        const discountedFood = foods.filter(food => food.discount === true);

        if (discountedFood.length <= 0) {
            return res.status(200).send(`Sorry, no discounted ${type} at the moment`);
        }

        return res.status(200).json({ discountedFood });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error ' + error.message);
    }
};

module.exports = {
    addFood, 
    getAFood, 
    buyFood,
    getFood,
    addToCart,
    getFoodBasedOnType, 
    deleteFood, 
    updateFood, 
    getDiscountedFood, 
    mostExpensiveFood,
    upload
}

// routes for v1.2
// mark order as ready for pickup
// receive order sent 
//update a food (eg, update price)
// discount a food
// get all Orders from a user