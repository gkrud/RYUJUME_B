const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../../model/User');

const register = async (req, res) => {
    const { id, pw, userName } = req.body;

    const userCreate = async (user) => {
        if(user) {
            throw new Error('username exists');
        } else {
            let salt = await crypto.randomBytes(32);
            let pwKey = crypto.pbkdf2Sync(pw,salt.toString('base64'),180822,64,'sha512');

            const user = new User();
            user.id = id;
            user.pw = pwKey;
            user.userName = userName;
            user.salt = salt;
            return user.save();
            //return User.create(id,pwKey,userName,salt);
        }
    }
    const respond = (user) => {
        res.json({
            message: 'registered successfully',
        })
    }
    
    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.stack
        })
    }

    let isUser = await User.findOne({id}).catch(onError);
    userCreate(isUser).then(respond).catch(onError);

}

const login = async(req,res)=>{
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
    let isUser = await User.findOne({id});

    check(isUser)
    .then(respond)
    .catch(onError)
}

module.exports = {
    login,
    register,
}