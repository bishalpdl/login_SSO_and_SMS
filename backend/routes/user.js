const express = require('express');
const moment = require('moment');
const bcrypt = require('bcrypt');
const axios = require('axios');

const jwt = require('jsonwebtoken');
const User = require('../model/user');
const OTP = require('../model/OTP')
const emailer = require('../utils/emailer');
const sparrowSMS = require('../utils/sparrowSMS');
const otp_generator = require('../utils/otp_generator');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('hello')
})

router.post('/send_otp', async(req, res)=> {
    try{
        let user = await User.findOne({email: req.body.email});
        console.log(user)
        if(user?.detail ==='google'){
            throw new Error('This email should be logged in with Google SSO.')
        }
        if(!user && req.body.operation === 'forgotpwd' && req.body.detail==='email' ){
            throw new Error('This user is not Registered.')
        }

        if(req.body.detail ==="phone"){
            user = await User.findOne({phone: req.body.phone})
            if(!user && req.body.operation ==='forgotpwd'){
                throw new Error('This user is not Registered')
            }
        }

        const sentAt = moment().format();
        const otp_string = otp_generator();
        
        let type ='';
        if(req.body.email){
            type = 'email'
        }else if(req.body.phone){
            type = 'phone'
        }else{
            throw new Error('Provide Email or Phone Number.')
        }
        console.log({type: type})
        
        if(type==='email'){
            const userOtp = await OTP.findOne({ email: req.body.email })
            if(!userOtp){
                const otp = new OTP({ email: req.body.email, otp_string: otp_string, sentAt});
                await otp.save();
            }else{
                userOtp.otp_string = otp_string;
                userOtp.sentAt = sentAt;
                await userOtp.save()
            }
            emailer(req.body.email, otp_string );
            console.log('email OTP')
        }
        
        if(type==='phone'){
            const userOtp = await OTP.findOne({ phone: req.body.phone })
            if(!userOtp){
                const otp = new OTP({ phone: req.body.phone, otp_string: otp_string, sentAt});
                await otp.save();
            }else{
                userOtp.otp_string = otp_string;
                userOtp.sentAt = sentAt;
                await userOtp.save()
            }
            // emailer(req.body.phone, otp_string );

            console.log('sparrow OTP')
            
            const response = await axios.post("http://api.sparrowsms.com/v2/sms/",
                data = {'token' : 'v2_AV4Juydy7i0E0LeOYqXt4t7TCGt.0j8g',
                  'from'  : 'Demo',
                  'to'    : `${req.body.phone}`,
                  'text'  : `Your OTP code for your Login_Form is ${otp_string}`
                }
            )
            
            //  sparrowSMS({phone: req.body.phone, otp_string})

            console.log(response)

        }

        res.send({status:'success', msg: "OTP Sent."});   
    }catch(e){
        console.log(e.message)
        res.send({status:'failure', msg: e.message})
    }

})

router.post('/register', async(req, res, next) => {
    // console.log(req.body)
    const {otp_string } = req.body;
    let existing_user = null;
    let detail = ''
    try{
        let otp = {};
        if(req.body.email){
            detail = 'email'
            otp = await OTP.findOne({email: req.body.email}); //use Promise.all instead
            existing_user = await User.findOne({email: req.body.email});
            console.log('Email Receiver')
        }else if(req.body.phone){
            detail = 'phone'
            otp = await OTP.findOne({phone: req.body.phone});
            existing_user = await User.findOne({phone: req.body.phone});
            console.log('Phone Receiver')
        }else{
            throw new Error('No Email or Phone is Provided.')
        }

        // console.log(existing_user)
        if(existing_user){throw new Error('User already Exists.')}

        if(!otp){
            throw new Error('OTP Required.')
        }
        if(otp.otp_string !== otp_string){
            throw new Error('OTP Not Matched.')
        }

        // also check if OTP time has expired.


        let user = new User({ ...req.body, detail:detail, isVerified: true });
        user = await user.save();
        const token = jwt.sign({id: user._id, email: user.email, phone:user.phone, detail }, process.env.JWT_SECRET)
        res.send({status: "success", msg: "User Saved.", token});
    }catch(e){
        console.log(e.message)
        res.send({status:'failure', msg: e.message})
    }
})

router.put('/sso-signin', async(req, res)=>{
    var user = null;
    try{
        const {isSSO, email, detail, ssoid, extraInfo} = req.body;
        if(isSSO){
            user = await User.findOne({email});
            console.log(user)
            
            if(user?.detail === 'email'){
                throw new Error('This Email is Associated with Password.')
            }

            if(detail === 'facebook'){
                user = await User.findOne({detail: 'facebook', ssoid})
                if(user){
                    console.log('Already Exists');
                    // const token = jwt.sign({id: user._id, detail }, process.env.JWT_SECRET)
                    // return res.send({status: "success", msg: "SSO Success", token})
                    
                }else{
                    console.log('User to be Created.')
                    let newUser = new User({ detail, ssoid, extraInfo})
                    user = await newUser.save();
                }
                console.log(user)
                const token = jwt.sign({id: user._id, detail, ssoid }, process.env.JWT_SECRET)
                return res.send({status: "success", msg: "SSO Success", token})
            }

            if(!user){
                let newUser = new User({email, detail, ssoid, extraInfo})
                user = await newUser.save();
            }
        }else{
            throw new Error('Not SSO Request')
        }

        console.log(user)
        const token = jwt.sign({id: user._id, detail, ssoid }, process.env.JWT_SECRET)
        console.log(token)
        res.send({status: "success", msg: "SSO Success", token})

    }catch(e){
        console.log("Error SSO block")
        console.log(e)
        res.send({status: "failure", msg: e.message})
    }
})

router.post('/login', async(req, res) => {
    try{
        const {email, phone, password} = req.body;
        let user = null;
        let detail = '';
        if(req.body.email){
            detail = 'email';
            user = await User.findOne({email});
            console.log(user)
            if(user?.detail==='google'){
                throw new Error('Please Login this email using Google SSO.')
            }
        }else if(req.body.phone){
            detail = 'phone'
            user = await User.findOne({phone})
        }
        if(!user){
            throw new Error("User Not Found.")
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        
        if(!passwordCheck){
            throw new Error('Password Incorrect')
        }
        const token = jwt.sign({id: user._id, email: user.email, phone:user.phone, detail }, process.env.JWT_SECRET)
        res.send({status:"success", msg:"Logged in", token})

    }catch(e){
        console.log(e.message)
        res.send({status:"failure",msg: e.message});
    }
})

router.put('/forgot_password', async(req, res)=>{
    const {email, phone, otp_string, password} = req.body;
    let user = null;
    let otp = {};
    try{
        
        if(req.body.email){
            user = await User.findOne({email});
            otp = await OTP.findOne({email: req.body.email});

        }else if(req.body.phone){
            user = await User.findOne({phone: req.body.phone});
            otp = await OTP.findOne({phone: req.body.phone})
        }
        if(!user){
            throw new Error("User Not Found.")
        } 

        if(otp_string !== otp.otp_string){
            throw new Error('OTP Not Matched')
        }
        user.password = req.body.password;
        await user.save();
        
        res.send({user})

    }catch(e){
        console.log(e.message);
        res.send({status:"failure", msg:e.message})
    }

})


router.get('/auth_test', auth ,async(req, res) => {
    res.send({_id: req._id})
    // res.send("incoming data");
})

module.exports = router;