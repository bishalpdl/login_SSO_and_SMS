const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        trim:true,   
    },
    phone:{
        type: String, //should be number
        trim:true,   
    },
    otp_string:{
        type: String
    },
    sentAt:{
        type: Date,
        default: Date.now()
    }
})



module.exports = mongoose.model("OTP", otpSchema)