const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const connectDB = require('./database/db')
const rabbitConnect = require('./rabbitConnect')
const FoodRouter = require('./routes/foodRoutes')
const session = require('express-session')
const methodOveride = require('method-override')
connectDB()
rabbitConnect()

// middlewares
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next()
})
app.use(express.static('uploads'))
//mounting routers
app.use(methodOveride('_method'))
app.use('/meal-api/v1/food/', FoodRouter)

const PORT = process.env.PORT || 9601
app.listen(PORT, ()=>{
    console.log(`Product Service Server is running on ${PORT}`);
})