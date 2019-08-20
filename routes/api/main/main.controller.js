const Ryujume = require('../../../model/Ryujume');
const User = require('../../../model/User');
const jwt = require('jsonwebtoken');


const latestInfo = (req,res) => {

    const findRyujume = async()=>{
        const ryujume = await Ryujume.find({},{userName:1,simpleInfo:1,likeNumber:1})
        .catch((e)=>res.status(500).json(e));
        
        return ryujume.reverse();
    }

    const respond = (ryujume)=>{
        res.json(ryujume);
    }
    
    const onError = (err)=>{
        res.status(403).json({
            message: err.message
        });
    }

    findRyujume()
    .then(respond)
    .catch(onError)
}

const infoDetail = async(req,res)=>{
    const token = req.headers['x-access-token'] || req.query.token;
    const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));

    const findUser = async (token)=>{
        const user = await User.findOne({id:token.id})
        .catch((e)=>res.status(500).json(e));
        return user;
    }

    const readDetail = async(user)=>{
        const ryujume = await Ryujume.findOne({_id:req.params._id},{id:0,__v:0,date:0,likeNumber:0})
        .catch((e)=>res.status(500).json(e));
        if(!ryujume) res.status(404).json({message:'Not found'});
        let status = 0;
        if(user.likeRyujume.includes(req.params._id))  status = 1;
        res.json({
            userName:ryujume.userName,
            profileImg:ryujume.profileImg,
            phoneNumber:ryujume.phoneNumber,
            email:ryujume.email,
            simpleInfo:ryujume.simpleInfo,
            career:ryujume.career,
            academicBack:ryujume.academicBack,
            prize:ryujume.prize,
            language:ryujume.language,
            link:ryujume.link,
            status:status
        });
    }
    // const respond = async(ryujume,status)=>{
    //     console.log(ryujume);
    //     res.json({
    //         ryujume,
    //         status
    //     });
    // }
    const onError = (err)=>{
        res.status(403).json({
            message: err.message
        });
    }

    findUser(tokenDecoded)
    .then(readDetail)
    //.then(respond)
    .catch(onError)
}

const likeInfo = (req,res)=>{

    const findRyujume = async()=>{
        const ryujume = await Ryujume.find({},{userName:1,simpleInfo:1,likeNumber:1})
        .catch((e)=>res.status(500).json(e));

        const ryujumes = ryujume.sort((a,b)=>{
            if (a.likeNumber > b.likeNumber) {
                return 1;
              }
              if (a.likeNumber < b.likeNumber) {
                return -1;
              }
              // a must be equal to b
              return 0;
        });
        return ryujumes;
    }

    const respond = (ryujumes)=>{
        res.json(ryujumes);
    }
    
    const onError = (err)=>{
        res.status(403).json({
            message: err.message
        });
    }

    findRyujume()
    .then(respond)
    .catch(onError)
}

const pressLike = async (req,res)=>{
    const token = req.headers['x-access-token'] || req.query.token;
    const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));

    const press = async(token)=>{
        const {status,ryujumeId} = req.body;
        if(status){
            const user = await User.findOne({id:token.id})
            .catch((e)=>res.status(500).json(e));
            user.likeRyujume = ryujumeId;
            user.save();
            const ryujume = await Ryujume.findOne({id:ryujumeId})
            .catch((e)=>res.status(500).json(e));
            ryujume.likeNumber += 1;
            ryujume.save();
        }
        else{
            const user = await User.findOne({id:tokenDecoded.id})
            .catch((e)=>res.status(500).json(e));
            const index = user.likeRyujume.indexOf(ryujumeId);
            if(index==-1){
                return;
            }
            user.likeRyujume.splice(index,0);
            user.save();
            const ryujume = await Ryujume.findOne({id:ryujumeId})
            .catch((e)=>res.status(500).json(e));
            ryujume.likeNumber -= 1;
            ryujume.save();
            return;
        }
    }
    const respond = ()=>{
        res.json({message:'success'});
    }
    const onError = (err)=>{
        res.status(403).json({
            message: err.message
        });
    }
    press(tokenDecoded).then(respond).catch(onError)
}

module.exports = {
    latestInfo,
    infoDetail,
    pressLike,
    likeInfo
}