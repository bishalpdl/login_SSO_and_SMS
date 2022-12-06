const jwt = require('jsonwebtoken');
const User = require('../model/user')

const auth = async(req, res, next) => {
    console.log('Auth middleware triggered')
    try{
        if(!req.header('Authorization')){
            throw new Error('You are not logged in.')
        }
        const token = req.header('Authorization').replace('Bearer ', '');
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: verified.id, detail: verified.detail})
        
        console.log(user);
        if(!user){
            throw new Error('No User Found')
        }
        
        req._id = user._id
        next();
    }catch(e){
        return res.send({status: "failure", msg: e.message})
    }

}

module.exports = auth;