const mongoose = require("mongoose")
const brcypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true
    }
})


userSchema.pre('save',async function(next){
    if(!this.isModified) next()
    this.password = await brcypt.hash(this.password,10)
})
userSchema.methods.comparePassword = async function(passwordEntered){
    return await brcypt.compare(passwordEntered,this.password)
}

userSchema.methods.generateToken =function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET_KEY,{
        expiresIn:'2h'
    })
}

module.exports = mongoose.model("User",userSchema)