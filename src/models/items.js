const mongoose=require('../db/mongoose.js');
const validator=require('validator');

const itemSchema=new mongoose.Schema({
    orderNumber:{
        type:String,
        required:true,
        trim:true
    },
    orderItem:{
        type:String,
        required:true,
        trim:true
    },
    orderDescription:{
     type:String,
     required:true,
     trim:true
    },
    orderNo:{
        type:Number,
        required:true
    },
    orderedUser:{
     type:mongoose.Schema.Types.ObjectId,
     required:true
    }
 },{
      timestamps:true
 })

 itemSchema.statics.findUserItems = async (number)=>{
    const userData=await itemModel.find({orderNumber:number});
    
    return userData;
}

const itemModel=mongoose.model('Item',itemSchema);

module.exports=itemModel;