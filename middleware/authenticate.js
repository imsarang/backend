const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
exports.authenticate = async (req, res, next) => {
    let token = req.headers['authorization']
    token = token.split(' ')[1]
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await User.findById({ _id: decoded.id }).select("-password")
        next()
    } catch (e) {
        console.log(e);
        return res.status(404).json({
            success: false,
            message: "User Authentication Failed!"
        })
    }
}