const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path: './config.env'});

// const MONGO_URI = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/ProductService?authSource=admin` || process.env.MONGO_URI_DEV
const MONGO_URI = process.env.MONGO_DB_USERNAME && process.env.MONGO_DB_HOST
    ? `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/ProductService?authSource=admin`
    : process.env.MONGO_URI_DEV;

const {
  Soup,
  Swallow,
  Snacks,
  Drinks,
  Dish,
  SingleFood,
  Protien,
} = require('./models/FoodModel');

// Load seed data
const seederData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'seeder.json'), 'utf-8')
);

// Connect to DB
const connectDB = async ()=>{
    try {
        console.log(MONGO_URI);
        await mongoose.connect(MONGO_URI)
        console.log(`database connected on ${MONGO_URI}`);
        

    } catch (error) {
        console.error('❌ DB Connection Error:', error);
        return error
    }
}


// Maps each key in seeder.json to its Mongoose model
const modelMap = {
  soups: Soup,
  swallows: Swallow,
  snacks: Snacks,
  drinks: Drinks,
  dishes: Dish,
  singleFoods: SingleFood,
  protiens: Protien,
};

// -i : import data into DB
const importData = async () => {
  try {
    for (const [key, Model] of Object.entries(modelMap)) {
      const records = seederData[key];
      if (records && records.length > 0) {
        await Model.create(records);
        console.log(`✅  ${records.length} ${key} imported`);
      }
    }
    console.log('🎉 Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error importing data:', err);
    process.exit(1);
  }
};

// -d : destroy all data in the mapped collections
const destroyData = async () => {
  try {
    for (const [key, Model] of Object.entries(modelMap)) {
      await Model.deleteMany();
      console.log(`🗑️  ${key} cleared`);
    }
    console.log('🎉 Data Destroyed Successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error destroying data:', err);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
 
  if (process.argv[2] === '-i') {
    await importData();
  } else if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    console.log('Please add a flag:\n  -i  to import data\n  -d  to destroy data');
    process.exit();
  }
};
 
run();