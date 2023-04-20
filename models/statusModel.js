const mongoose = require("mongoose")

const statusSchema = new mongoose.Schema({
    status:{
        type:String,
        required:true,
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    task:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }
},{timestamps:{
    createdAt:false
}})

module.exports = mongoose.model("Status",statusSchema)