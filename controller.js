require('dotenv').config();
const User = require('./model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Redis = require('./redis.connect');

exports. DaftarUser = async (req,res) => {

    try {
       const {username, password, email} = req.body
       const hashpassword = await bcryptjs.hash(password, 10)
       const data = await new User({
            username: username,
            email: email,
            password: hashpassword,
       }).save();
    if (data) {
        const users = await User.find()
        Redis.set('fetch_1', JSON.stringify(users))
        console.log('Success fetch from database');
        if(users) {
            res.status(200).json({
                status: "success",
                data: data,
              });
        }else {
            res.status(500).json({
                status: "fail",
                message: "Fail save to redis",
              });
        }
      
    } else {
      res.status(500).json({
        status: "fail",
        message: "Internal Server Error",
      });
    }
} catch (error) {
    console.error(error);
   
    }

};

exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const { reply } = await Redis.get('fetch_1')
        const redis_users = JSON.parse(reply || '[]');
        let user;
        const called_users = redis_users.find(item => item.username == username)
        if(called_users === undefined) {
             user = await User.findOne({ $or: [{username: username}, {email: username}] });
        }else {
            user = called_users;
            console.log('Success fetch from Redis');
        }

        
        if(user) {
            //jika username tersedia masuk kesini
            const passwordUser = await bcryptjs.compare(password, user.password)
            if(passwordUser) {
                const data = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                }
            const token = await jwt.sign(data, process.env.SECRET)
            return res.status(200).json({
                message: 'login success',
                data: data,
                token: token,
                redis: req.redis
            })    
            }
        }else {
            res.status(500).json({
                status: "fail",
                message: "Internal Server Error",
              });
        }

    }catch (error) {
        console.error(error);
        res.status(500).json(error);

    }
    
}

//format of token
// athorization : Bearer <access_token>

// verify token
exports.verifyToken = (req, res, next) => {
    //get header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undifined
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        //forbidden
        res.sendStatus(403);
    }

}