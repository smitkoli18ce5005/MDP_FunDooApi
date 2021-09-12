const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')
const auth = require('../authentication/auth')

userRouter.get('/getAllUsers', auth.verifyToken, userController.getAllUsers)

userRouter.get('/getUser/:id', auth.verifyToken, userController.getUserByID, userController.displayUser)

userRouter.post('/login',auth.createToken , userController.getUserByCredentials)

userRouter.post('/userSignUp', userController.validationRules(), userController.validateUser, userController.getUserByEmail, userController.addNewUser)

userRouter.delete('/deleteUser/:id', auth.verifyToken, userController.getUserByID, userController.deleteUser)

module.exports = userRouter