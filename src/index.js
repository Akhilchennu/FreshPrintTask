const express=require('express');
require('./db/mongoose');
const userModel=require('./models/users');
const orderModel=require('./models/orders');
const itemModel=require('./models/items');
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

app.post('/createOrder',auth,async (req,res)=>{
     const orderData=new orderModel({
         ...req.body,
         orderedUser:req.user._id
     })
     const itemData=new itemModel({
         ...req.body,
         orderedUser:req.user._id
     })
    try{
        await orderData.save();
        await itemData.save();
        res.status(200).send({success:true}) 
     }catch(error){
         res.status(400).send({success:false,error:error});
     }
})

app.get('/getOrders',auth,async (req,res)=>{
    try{
        const orderData=await orderModel.findUserOrders(req.user._id);
        if(!orderData){
            res.send({
                success:true,
                orderedData:[]
            })
        }
        res.send({success:true,orderedData:orderData}) 
     }catch(error){
         res.status(400).send({success:false,error:error});
     }
})

app.get('/getItems',auth,async (req,res)=>{
    try{
        const orderData=await orderModel.findUserOrders(req.user._id);
        if(!orderData){
            res.send({
                success:true,
                orderedItems:[]
            })
        }
        const itemData=await itemModel.findUserItems(orderData["orderNumber"])
        if(!itemData){
            res.send({
                success:true,
                orderedItems:[]
            })
        }
        res.send({success:true,orderedItems:itemData}) 
     }catch(error){
         res.status(400).send({success:false,error:error});
     }
})

app.listen(3000,()=>{
    console.log("server listening in port 3000")
})