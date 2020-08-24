const mongoose=require('../db/mongoose.js');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userSchema=new mongoose.Schema({
   userName:{
       type:String,
       required:true,
       trim:true
   },
   password:{
       type:String,
       required:true,
       minlength:6
   },
   fullName:{
    type:String,
    required:true,
    trim:true
   },
   phoneNumber:{
    type:String,
    required:true,
    trim:true,
    validate(value){
        if(!validator.isMobilePhone(value)){
            throw new error('phone number is invalid')
        }
    }
   },
   email:{
       type:String,
       required:true,
       trim:true,
       unique:true,
       lowercase:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new error('Email is invalid')
           }
       }
   },
   tokens:[{
       token:{
         type:String,
         required:true
       }
   }]
},{
     timestamps:true
})


userSchema.pre('save',async function(next) {
      const userModel=this;
      if(userModel.isModified("password")){
      userModel.password=await bcrypt.hash(userModel.password,8);
      }
      next();
  });

  userSchema.statics.findByCredentials = async (email,password)=>{
      const userData=await userModel.findOne({email});
      if(!userData){
          throw new Error('username or password is invalid');
      }
      const isMatch=await bcrypt.compare(password,userData.password)
      if(!isMatch){
          throw new Error("username or password is invalid");   
      }
      return userData;
  }

  userSchema.methods.generateAuthToken=async function(){
    const userModel=this;
    const token=jwt.sign({_id:userModel._id.toString()},"secretkeyissecret");
    userModel.tokens=userModel.tokens.concat({token});
    await userModel.save();
    return token;
  }

  userSchema.methods.toJSON=function(){
      const userModal=this;
      const newResponse=userModal.toObject();
      delete newResponse.password;
      delete newResponse.tokens;
      return newResponse
  }

const userModel=mongoose.model('User',userSchema);

module.exports=userModel;