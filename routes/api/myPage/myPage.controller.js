const jwt = require('jsonwebtoken');
const User = require('../../../model/User');
const Ryujume = require('../../../model/Ryujume');

const writeInfo = async (req,res)=>{
    const token = req.headers['x-access-token'] || req.query.token;
    const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));

    const check = async(token)=>{
        const ryujume = await Ryujume.findOne({id:token.id})
        .catch((e)=>res.status(500).json(e));
        if(!ryujume.length) throw new Error('you already have ryujume');
        return token;
    }

    const createMyPage = async(token)=>{
        const user = await User.findOne({id:token.id})
        .catch((e)=>res.status(500).json(e));
            const {userName,id} = user;
            const {
                phoneNumber,
                email,
                simpleInfo,
                career,
                academicBack,
                prize,
                language,
                link
            } = req.body;

            const ryujume = new Ryujume({
                userName,
                id,
                phoneNumber,
                email,
                simpleInfo,
                career,
                academicBack,
                prize,
                language,
                link
            });
            return ryujume.save();
    }

    const respond = (ryujume)=>{
        res.status(200).json(ryujume);
    }

    const onError = (err)=>{
        res.status(409).json({
            message: err.stack
        });
    }
    check(tokenDecoded)
    .then(createMyPage)
    .then(respond)
    .catch(onError)
}

const updateInfo = async(req,res)=>{
    const token = req.headers['x-access-token'] || req.query.token;
    const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));

    const updateRyujume = async(token)=>{
        const update = await Ryujume.update({id:token.id},{$set:req.body})
        .catch((e)=>res.status(500).json(e));
        return update;
    }
    const respond = (update)=>{
        if(!update.n){
            throw new Error('book not found');
        }
        res.json({ message: "book updated" });
    }
    const onError = (err)=>{
        res.status(409).json({
            message: err.stack
        });
    }

    updateRyujume(tokenDecoded)
    .then(respond)
    .catch(onError)
}

const updateProfileImg= async(req,res)=>{
    const token = req.headers['x-access-token'] || req.query.token;
    const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));

    const updateImg = async (token)=>{
        const profileImg = req.file.fileName;
        const ryujume = await Ryujume.findOne({id:token.id})
        .catch((e)=>res.status(500).json(e));
        profileImg = 'http://10.156.145.132/public/'+profileImg;
        ryujume.profileImg = profileImg;
        return ryujume.save();
    }
    const respond = (ryujume)=>{
        res.json({
            profileImg:ryujume.profileImg
        });
    }
    const onError = (err)=>{
        res.status(409).json({
            message: err.stack
        });
    }
    updateImg(tokenDecoded)
    .then(respond)
    .catch(onError)
}

const readMyInfo = async (req,res)=>{
    const token = req.headers['x-access-token'] || req.query.token;
    const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));

    const findMyInfo = async(token)=>{
        const ryujume = await Ryujume.findOne({id:token.id},{id:0})        
        .catch((e)=>res.status(500).json(e));
        return ryujume;
    }
    const respond = (ryujume)=>{
        res.json(ryujume);
    }
    const onError = (err)=>{
        res.status(409).json({
            message: err.stack
        });
    }

    findMyInfo(tokenDecoded)
    .then(respond)
    .catch(onError)
}

const readLikeInfo = async(req,res)=>{
    const token = req.headers['x-access-token'] || req.query.token;
    const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));

    const findUser = async(token) =>{
        const user = await User.findOne({id:token.id})
        .catch((e)=>res.status(500).json(e));
        if(!user.likeRyujume.length)     res.json({message:"you don't have like ryujume"});
        return user.likeRyujume;
    }
    const findRyujumes = async(likeRyujume)=>{
        const ryujumes =[];
        for(let i=0;i<likeRyujume;i++){
            const ryujume = await Ryujume.findOne({likeRyujume:likeRyujume[i]},{userName:1,simpleInfo:1})
            .catch((e)=>res.status(404).json(e));
            ryujumes.push(ryujume);
        }
        return ryujumes;
    }
    const respond = (ryujumes)=>{
        res.json(ryujumes);
    }
    const onError = (err)=>{
        res.status(409).json({
            message: err.stack
        });
    }
    findUser(tokenDecoded)
    .then(findRyujumes)
    .then(respond)
    .catch(onError)
}

module.exports = {
    writeInfo,
    updateInfo,
    updateProfileImg,
    readMyInfo,
    readLikeInfo
}