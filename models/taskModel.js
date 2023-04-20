const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    task_description:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    statusLogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Status"
    }]
},{timestamps:true})

module.exports = mongoose.model("Task",taskSchema)