/* eslint-disable no-console */
require('dotenv').config();

const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('🛢 Database is connected successfully');
  } catch (err) {
    console.log('Failed to connect database', err);
  }
};
connectToMongo();
