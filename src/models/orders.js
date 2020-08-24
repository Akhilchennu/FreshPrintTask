const mongoose=require('../db/mongoose.js');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    orderNumber:{
        type:String,
        required:true,
        trim:true
    },
    orderDate:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isDate(value)){
                throw new error('orderDate is invalid')
            }
        }
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

const orderModel=mongoose.model('Order',userSchema);

module.exports=orderModel;