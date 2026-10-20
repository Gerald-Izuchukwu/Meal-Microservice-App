const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const connectDB = require('./database/db')
const DeliveryRouter = require('./routes/index.js')
const {startDeliveryConsumer} = require('./controllers/DeliveryContrl')
connectDB()
startDeliveryConsumer()

app.use(morgan('dev'))
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

//mounting routers
app.get('/meal-api/v1/delivery/health', (req, res)=>{
    res.status(200).json({
        status: "success",
        message: "Delivery Service is running"
    })
})
app.use('/meal-api/v1/delivery/', DeliveryRouter)

const PORT = process.env.PORT || 9603
app.listen(PORT, ()=>{
    console.log(`Delivery Service Server is running on ${PORT}`);
})