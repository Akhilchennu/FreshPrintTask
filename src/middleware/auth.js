const userModel=require('../models/users');
const jwt=require('jsonwebtoken');

const auth=async (req,res,next)=>{
    try{
    const token=req.header('Authorization').replace('Bearer','').trim();
    const decoded=jwt.verify(token,"secretkeyissecret");
    const userData=await userModel.findOne({_id:decoded._id,'tokens.token':token});
    if(!userData){
        throw new Error("user profile not found");
    }
    req.token=token;
    req.user=userData;
    next()
    }catch(error){
       res.status(401).send({error:'please authenticate'});
    }
}

module.exports=auth;