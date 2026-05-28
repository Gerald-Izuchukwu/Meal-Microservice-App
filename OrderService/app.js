const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const express = require('express')
const morgan = require('morgan')
const app = express()
const connectDB = require('./database/db')
const rabbitConnect = require('./rabbitConnect')
const OrderRouter = require('./routes/orderRoutes')
connectDB()
rabbitConnect()

app.use(morgan('dev'))


app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/meal-api/v1/order/health', (req, res)=>{
    res.status(200).json({
        status: "success",
        message: "Order Service is running"
    })
})

//mounting routers
app.use('/meal-api/v1/order/', OrderRouter)


const PORT = process.env.PORT || 9600
app.listen(PORT, ()=>{
    console.log(`Order Service Server is running on ${PORT}`);
})