const { USER_ROLE } = require('../controllers/userController')
const User = require('../models/userModel')

exports.checkAdmin = async(req,res,next)=>{
    const user = await User.findById({_id:req.user._id})
    if(user.role==USER_ROLE.ADMIN)
        next()
    else  return res.status(401).json({
        success:false,
        message:"only admin access allowed"
    })
}