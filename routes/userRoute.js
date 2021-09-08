const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')

userRouter.get('/', userController.getAllUsers)

userRouter.get('/login', userController.getUserByCredentials)

userRouter.post('/userSignUp', userController.validationRules(), userController.validateUser, userController.getUserByEmail, userController.addNewUser)

userRouter.delete('/:id', userController.getUserByID, userController.deleteUser)

module.exports = userRouter