const mongoose = require('mongoose')
const MONGO_URI  = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/${process.env.MONGO_DB_NAME}?${process.env.DB_POST_MESSAGE}` || process.env.MONGO_URI_DEV


console.log(MONGO_URI);

const connectDB = async ()=>{
    const tlsOptions = process.env.DB_POST_MESSAGE?.includes("tls=true")
    ? { tls: true, tlsCAFile: "/app/certs/global-bundle.pem" }
    : {};
    try {
        await mongoose.connect(MONGO_URI, {
            retryWrites: false,
            ...tlsOptions
        })
        console.log(`database connected on ${MONGO_URI}`);

    } catch (error) {
        console.log(error);
        return error
    }
}
module.exports = connectDB