const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const express = require('express')
const morgan = require('morgan')
const app = express()
const connectDB = require('./database/db')
const UserRouter = require('./routes/userRoutes')
connectDB()

app.use(morgan('dev'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

//mounting routers
app.use('/meal-api/v1/auth/', UserRouter)

const PORT = process.env.PORT || 9602
app.listen(PORT, ()=>{
    console.log(`User-Auth Service Server is running on ${PORT}`);
})