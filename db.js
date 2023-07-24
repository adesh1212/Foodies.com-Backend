const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.mongoURI;

// console.log(process.env.mongoURI)
const connetToDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        const fetch_data = mongoose.connection.db.collection("food_items").find({});
        const results = await fetch_data.toArray();
        if (results.length > 0) {
            // console.log(results);
            global.food_items = results;
            // console.log(global.food_items);
        } else {
            console.log(`No listings found`);
        }

        const food_category = mongoose.connection.db.collection("food_category").find({});
        const catData = await food_category.toArray();
        if (catData.length > 0) {
            global.food_category = catData;
        } else {
            console.log(`No listings found`);
        }
    }
    catch (err) {
        throw err;
    }
}
module.exports = connetToDB;
