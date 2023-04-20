const express = require("express")
const { assignTask, showAllTasks, updateTaskAssigned, deleteTask, showCurrentUserTasks, showTaskByID} = require("../controllers/taskController")
const { authenticate } = require("../middleware/authenticate")
const router = express.Router()

router.route('/assign').post(authenticate,assignTask)
router.route('/showAll').get(authenticate,showAllTasks)
router.route('/update/:taskId').put(authenticate,updateTaskAssigned)
router.route('/delete/:taskId').delete(authenticate,deleteTask)
router.route('/show').get(authenticate,showCurrentUserTasks)
router.route('/get/:taskId').get(authenticate,showTaskByID)
module.exports = router
