const mongoose = require('mongoose')
const MONGO_URI = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/DeliveryService?authSource=admin` || process.env.MONGO_URI_DEV 


const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGO_URI)
        console.log(`database connected on ${MONGO_URI}`);

    } catch (error) {
        console.log(error);
        return error
    }
}
module.exports = connectDB