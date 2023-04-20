const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel")
const Status = require("../models/statusModel")
const Task = require("../models/taskModel");
const { USER_ROLE } = require("./userController");
const { findById, findByIdAndUpdate } = require("../models/userModel");

exports.TASK_ENUM = {
    CREATED:'created',
    IN_PROGRESS:'in progress',
    COMPLETED:'completed',
    CLOSED:'closed'
}

exports.assignTask = catchAsyncErrors(async(req,res)=>{
    let task
    if(req.body.assigned.length==0) return res.status(400).json({
        success:false,
        message:`Atleast 1 TM USER should be assigned a task `
    })

    for(let i =0;i<req.body.assigned.length;i++)
    {
        const assignId = req.body.assigned[i]
        const user = await User.findOne({_id:assignId})
        // if(user.role==USER_ROLE.ADMIN) return res.status(403).json({
        //     success:false,
        //     message:"Cannot assign tasks to Admin"
        // })
        
        const status = await Status.create({
            status:this.TASK_ENUM.CREATED,
            updatedBy:req.user._id,
        })
        task = await Task.create({
            task_description:`${req.user.name} assigned task to ${user.name}`,
            statusLogs:status._id,
            createdBy:req.user._id,
            assignedTo:assignId
        })
    }
    
    
    if(task) return res.status(200).json({
        success:true,
        task,
        message:"Task Successfully Assigned"
    })
    else return res.status(404).json({
        success:false,
        message:"Cannot assign task"
    })
})

exports.showAllTasks = catchAsyncErrors(async(req,res)=>{
    const task = await Task.find().sort({"timestamp" : -1}).populate("createdBy assignedTo statusLogs")

    if(task) return res.status(200).json({
        success:true,
        task
    })
    else return res.status(403).json({
        success:false,
        message:"No tasks to display!"
    })
})

exports.updateTaskAssigned = catchAsyncErrors(async(req,res)=>{
    const {userId,progress,role,statusId} = req.body
    const {taskId} = req.params

    let task = await Task.findOne({_id:taskId})
    let c = (userId!=task.assignedTo && userId!=task.createdBy) && role!=USER_ROLE.ADMIN
    
    if(c) return res.status(401).json({
        success:false,
        message:"This is not your task"
    })
    
    const s = await Task.findById({_id:taskId}).populate("statusLogs")
    // console.log(s);
    // for(let i = 0;i<s.statusLogs.length;i++)
    // {
    //     if(s.statusLogs[i].status===this.TASK_ENUM.CLOSED) return res.status(401).json({
    //         success:false,
    //         message:"Cannot update Closed Task"
    //     })
    // }
    const result = s.statusLogs[s.statusLogs.length-1].status
    if(result == this.TASK_ENUM.CLOSED) return res.status(401).json({
        success:false,
        message:"Cannot Update closed Task"
    })
    const check = await Status.findById({_id:statusId})
    if(check.status == progress) return res.status(200).json({
        success:false,
        message:"Same as current status"
    })
    const status = await Status.create({
        status:progress,
        updatedBy:userId
    })

    task = await Task.findByIdAndUpdate({_id:taskId},{
        $addToSet:{
            statusLogs:status._id
        }
    },{new:true}).populate("statusLogs createdBy assignedTo")

    if(task) return res.status(200).json({
        success:true,
        task,
        message:'Task updated'
    })
    else return res.status(404).json({
        success:false,
        message:"Cannot change status"
    })
    
})

exports.deleteTask = catchAsyncErrors(async(req,res)=>{
    const {taskId} = req.params

    const task = await Task.findByIdAndDelete({_id:taskId})
    for(let i =0;i<task.statusLogs.length;i++)
    {
        const status = await Status.findByIdAndDelete({
            _id:task.statusLogs[i]
        })
    }
    if(task) return res.status(200).json({
        success:true,
        message:"Task Deleted"
    })
    else return res.status(404).json({
        success:false,
        message:"Task could not be deleted"
    })
})

exports.showCurrentUserTasks = catchAsyncErrors(async(req,res)=>{
    const createdByTask = await Task.find({
            createdBy:req.user._id
    }).populate("createdBy assignedTo statusLogs")
    
    const assignedToTask = await Task.find({
        assignedTo:req.user._id
    }).populate("createdBy assignedTo statusLogs")

    if(createdByTask||assignedToTask) return res.status(200).json({
        success:true,
        createdByTask,assignedToTask
    })
    else return res.status(400).json({
        success:false,
        message:"No tasks to be displayed"
    })
})

exports.showTaskByID = catchAsyncErrors(async(req,res)=>{
    const task = await Task.findById({_id:req.params.taskId})
                        .populate("statusLogs")
    if(task) return res.status(200).json({
        success:true,
        task
    })
    else return res.status(400).json({
        success:false,
        message:"Cannot view this task"
    })
})