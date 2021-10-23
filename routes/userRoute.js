const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

userRouter.get('/getAllUsers', auth.verifyToken, userController.getAllUsers)

userRouter.get('/getUser', auth.verifyToken, userController.getUserByID, userController.displayUser)

userRouter.delete('/deleteUser/:id', auth.verifyToken, userController.getUserByID, userController.deleteUser)

userRouter.post('/login', userController.loginUser)

userRouter.post('/userSignUp', userController.validationRules(), userController.returnValidationErrors, userController.getUserByEmail, userController.addNewUser)

userRouter.post('/forgetPassword', userController.getUserByEmail, userController.forgetPassword)

userRouter.patch('/resetPassword/:token', userController.validatePassword, userController.verifyToken, userController.resetPassword)

module.exports = userRouter