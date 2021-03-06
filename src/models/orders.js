const mongoose=require('../db/mongoose.js');
const validator=require('validator');

const orderSchema=new mongoose.Schema({
    orderNumber:{
        type:String,
        required:true,
        trim:true
    },
    orderDate:{
        type:String,
        required:true
    },
    orderDescription:{
     type:String,
     required:true,
     trim:true
    },
    orderedUser:{
     type:mongoose.Schema.Types.ObjectId,
     required:true
    }
 },{
      timestamps:true
 })

 orderSchema.statics.findUserOrders = async (userId)=>{
    const userData=await orderModel.find({orderedUser:new mongoose.Types.ObjectId(userId)});
    
    return userData;
}

const orderModel=mongoose.model('Order',orderSchema);

module.exports=orderModel;