const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const express = require('express')
const morgan = require('morgan')
const app = express()
const connectDB = require('./database/db')
const rabbitConnect = require('./rabbitConnect')
const OrderRouter = require('./routes/orderRoutes')
const UserRouter = require('./routes/userRoutes')
connectDB()
rabbitConnect()

app.use(morgan('dev'))

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs'); //set this at the general level

app.use(express.urlencoded({extended: false}))
app.use(express.json())

//mounting routers
app.use('/meal-api/v1/order/', OrderRouter)
app.use('/meal-api/v1/auth/', UserRouter)


const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Order Service Server is running on ${PORT}`);
})