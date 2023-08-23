const mongoose = require('mongoose')
const Mongo_URI = process.env.MONGO_URI

const connectDB = async ()=>{
    try {
        await mongoose.connect(Mongo_URI)
        console.log('database connected');

    } catch (error) {
        console.log(error);
        return error
    }
}
module.exports = connectDB