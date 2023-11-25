const mongoose=require("mongoose");

const userSchem =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
    isAvtarImageSet:{
        type:Boolean,
        default:false
    },
    avtarImage:{
        type:String,
        default:""
    },
})

module.exports=mongoose.model("Users_Data",userSchem);
