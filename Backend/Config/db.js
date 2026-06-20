const mogoose = require("mongoose");

const connectedDB = async () => {
    try {
        await mogoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed", error);
         
    }   
};

module.exports = connectedDB;