const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../../models/User');

const register = async (req, res) => {
    const { id, pw, userName } = req.body;

    const userCreate = (user) => {
        if(user) {
            throw new Error('username exists');
        } else {
            let salt = await crypto.randomBytes(32);
            let pwKey = await crypto.pbkdf2(pw,salt.toString('base64'),180822,64,'sha512');
            return User.create(id,pwKey,userName,salt);
        }
    }
    
    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.stack
        })
    }

    let isUser = await User.findOne(id);
    userCreate(isUser).catch(onError);
}

const login = (req,res)=>{
    const {id,pw} = req.body;
    const secret = req.app.get('jwt-secret');

    const check = (user) => {
        
        if(!user) {
            // user does not exist
            throw new Error('You must signup');
        } else {
            // user exists, check the password
            if(user.verify(pw)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            id:user.id
                        }, 
                        secret, 
                        {
                            expiresIn: '100h',
                            issuer: 'gkrud',
                            subject: 'user_info'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        });
                }); 
                return p;
            } else {
                throw new Error('login failed');
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token,
        });
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        });
    }

    // find the user
    let isUser = await User.findOne(id);
    
    check(isUser)
    .then(respond)
    .catch(onError)
}

module.exports = {
    login,
    register,
}