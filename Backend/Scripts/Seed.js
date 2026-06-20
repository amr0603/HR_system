require("dotenv").config();

const mongoose = require("mongoose");
const Admin =require("../Models/Admin");

const addsuper = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
        const existingAdmin = await Admin.findOne({
            email: process.env.EMAIL_ADMIN,
        });
        if (existingAdmin) return console.log("Super admin already exists");
        const superadmin ={
            username: "superadmin",
            email: process.env.EMAIL_ADMIN,
            password: "supera56",
        }
        const admin = await Admin.create(superadmin);
        console.log("Super admin added successfully");
    } catch (error) {
        console.error("Error adding super admin:", error);
    }
    finally {
         await mongoose.connection.close();
         console.log("Database connection closed");
         process.exit(0);
    }
};
addsuper();