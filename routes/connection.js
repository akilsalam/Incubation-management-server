const mongoose = require("mongoose")
const connect = mongoose.connect('mongodb://127.0.0.1:27017/IncubationSite');

//check database connected or not 
connect.then(()=>{
    console.log("Database Connected");
})
.catch(()=>{
    console.log("Database Failed");
})

//Create Schema
const UserSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const ApplySchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    describeTeam: { type: String, required: true },
    describeCompany: { type: String, required: true },
    problemSolve: { type: String, required: true},
    status: {type: String, required: true},
})

const BookingSchema = new mongoose.Schema({
    onClick: {type:String, required:true},
    user: {type:String, required:false},
    seatNumber : {type:String, required:true}
})

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


//collection Part
const Users = new mongoose.model("users",UserSchema)
const ApplyForm = new mongoose.model("applyForm",ApplySchema)
const Admin = new mongoose.model("admin",AdminSchema)
const BookingData = new mongoose.model("bookedslot",BookingSchema)

module.exports = {Users,ApplyForm,Admin,BookingData}