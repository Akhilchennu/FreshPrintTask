const express=require('express');
require('./db/mongoose');
const userModel=require('./models/users');
const auth=require('./middleware/auth');
const app=express();

app.use(express.json());

app.post('/signup',async (req,res)=>{
    try{
    const user=new userModel(req.body);
    await user.save();
    res.send(user);
    }
    catch(error){
     res.status(400).send({success:false,error:error});
    }
})
 
app.post('/login',async (req,res)=>{
    try{
       const user=await userModel.findByCredentials(req.body.email,req.body.password);
       const token=await user.generateAuthToken();
       const userData=await user.toJSON();
       res.send({success:true,userinfo:{userData,token}}) 
    }catch(error){
        res.status(400).send({success:false,error:error});
    }
})

app.get('/orderDetails',auth,async (req,res)=>{
    const data=await req.user.toJSON();//asynchronous actions taking place and returning {} so called toJSON() with await
    res.send({userinfo:data})
})

app.listen(3000,()=>{
    console.log("server listening in port 3000")
})