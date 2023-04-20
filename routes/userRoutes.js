const express = require("express")
const { registerUser, loginUser, logoutUser, showUsers, currentUser, searchUser, removeAccount } = require("../controllers/userController")
const { authenticate } = require("../middleware/authenticate")
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(authenticate,logoutUser)
router.route('/showusers').get(showUsers)
router.route('/current').get(authenticate,currentUser)
router.route('/search').get(authenticate,searchUser)
router.route('/remove').delete(authenticate,removeAccount)
module.exports = router
