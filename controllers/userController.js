const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const User = require("../models/userModel")
const Task = require("../models/taskModel")

exports.USER_ROLE = {
    ADMIN:"Admin",TM_USER:'TM USER'
}
exports.registerUser = catchAsyncErrors(async(req,res)=>{
    const {name,email,password,cpassword} = req.body
    let {role} = req.body
    if(!name||!email||!password||!cpassword) return res.status(401).json({
        success:false,
        message:"Please fill all the credentials"
    })
    if(password!=cpassword) return res.status(403).json({
        success:false,
        message:"Invalid credentials"
    })
    if(!role || role==='') role = this.USER_ROLE.TM_USER
    if(role=='admin') role = this.USER_ROLE.ADMIN
    const user = await User.create({
        name,email,password,role
    })
    if(user) return res.status(200).json({
        success:true,
        user,
        message:'User successfully registered'
    })
})

exports.loginUser = catchAsyncErrors(async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password) return res.status(401).json({
        success:false,
        message:"Please fill all the details"
    })
    const user = await User.findOne({email:email})
    if(!user) return res.status(400).json({
        success:false,
        message:"User not regisetered"
    })
    const isMatched = await user.comparePassword(password)
    if(isMatched){
        const token =user.generateToken()
        return res.cookie('jwt',token,{
            httpOnly:true,
            maxAge:2 * 60 * 60 * 1000
        })
        .status(200).json({
            success:true,
            message:"User Logged In",
            user,token
        })
        
    }else return res.status(403).json({
        success:false,
        message:"Invalid Credentials"
    })
})

exports.logoutUser = catchAsyncErrors(async(req,res)=>{
    const cookies = req.cookies
   
    if(!cookies.jwt) return res.sendStatus(204)
    res.clearCookie('jwt',{httpOnly:true})
    res.status(200).json({
        success:true,
        message:"User Logged Out"
    })
})

exports.showUsers = catchAsyncErrors(async(req,res)=>{
    const user = await User.find()
    return res.status(200).json({
        success:true,
        user
    })
})

exports.currentUser = catchAsyncErrors(async(req,res)=>{
   
    if(req.user) return res.status(200).json({
        success:true,
        user:req.user,
    })
})

exports.searchUser = catchAsyncErrors(async(req,res)=>{
    const keyword = req.query.user?{
       $or:[
            {name:{$regex:req.query.user,$options:"i"}},
            {email:{$regex:req.query.user,$options:"i"}}
       ] 
    }:{}

    const user = await User.find(keyword).find({_id:{$ne:req.user._id}})
    if(user) return res.status(200).json({
        success:true,
        user
    })
    else res.status(400).json({
        success:false,
        message:"No User Found!"
    })
})

exports.removeAccount = catchAsyncErrors(async(req,res)=>{
    const task = await Task.deleteMany({
        $or:[{createdBy:req.user._id},{assignedTo:req.user._id}]})
    const user = await User.findByIdAndDelete({_id:req.user._id})
    if(user) return res.status(200).json({
        success:true,
        message:'Account removed '
    })
    else return res.status(400).json({
        success:false,
        message:"Error in removing account"
    })
})