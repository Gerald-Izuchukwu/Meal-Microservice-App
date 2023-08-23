const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const express = require('express')
const morgan = require('morgan')
const app = express()
const connectDB = require('./database/db')
const path = require('path')
connectDB()

app.use(morgan('dev'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Product Service Server is running on ${PORT}`);
})