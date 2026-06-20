const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({

    name: {
         type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 50,

    },
    email: {
   type: String,
   required: true,
   unique: true
},
    age : {
        type: Number,
      required: true,
      min: 18,
      max: 60,
    },
    phone : {
         type: String,
      required: true,
      unique: true,
    },
    department :{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    position: {
   type: String
},
    image : {
        type: String,
      default: "default.png",
    },

    address :{
         type: String,
      required: true,
      trim: true,
    },
    salary : {
       type: Number,
      required: true, 
    }, 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

},{timestamps:true});

const employee = mongoose.model("Employee", employeeSchema);
module.exports= employee;