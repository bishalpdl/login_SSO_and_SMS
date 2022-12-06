const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        trim:true,   
        
        // unique:true,
        // required: ['true', 'Email is Required'],
        // validate:{
        //     validator: function(v){
        //         if(!validator.isEmail(v)){
        //             throw new Error('Email format error')
        //         }
        //     }
        // }

    },
    phone: {
        type: String, // should be Number
    },
    password:{
        type: String,
        minlength:5
    },
    detail:{
        type: String,
    },
    ssoid:{
        type: String,
    },
    extraInfo:{
        name: {type: String},
        imageURL: {type: String},
        email: {type: String},
    },
    isVerified:{
        type: Boolean,
        default: true
    }
})

userSchema.pre('save', async function(next){
    try {
        if(this.password){
            const salt = await bcrypt.genSalt(8);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
    } catch (error) {
        next(error)
    }
});


module.exports = mongoose.model("User", userSchema)