require('dotenv').config()
const userModel = require('../models/userModel')
const logger = require('../logger/userLogger')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let userService = {

    //to return all users
    async getAllUsersService(req, res) {
        try {
            const allUsers = await userModel.find();
            if(allUsers.length > 0) {
                logger.log('info', `Status: 200: Successfully returned all users`)
                let responseObject = this.createResponseObject()
                responseObject.status = 200
                responseObject.success = true
                responseObject.message = "Successfully returned all users"
                responseObject.data = allUsers
                res.status(200).json(responseObject)
            } else {
                logger.log('error', `Status: 404: No users found`)
                let responseObject = this.createResponseObject()
                responseObject.status = 404
                responseObject.success = false
                responseObject.message = "No users found"
                responseObject.data = allUsers
                res.status(200).json(responseObject)
            }
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //service for login
    async loginService(req, res){
        const user = await userModel.find({email: req.body.email})
       
        if(user.length > 0){
            bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                if(error){
                    logger.log('error', `Status: 500: ${error.message}`)
                    throw error
                }
                if(result){
                    logger.log('info', `Status: 200: Successfully logged in`)
                    const token = jwt.sign({email: user[0].email, id: user[0]._id}, process.env.TOKEN_KEY)
                    let responseObject = this.createResponseObject(user[0], token)
                    responseObject.status = 200
                    responseObject.success = true
                    responseObject.message = "Successfully logged in"
                    res.status(200).json(responseObject)
                } else {
                    logger.log('error', `Status: 401: Invalid Credentials`)
                    let responseObject = this.createResponseObject()
                    responseObject.status = 401
                    responseObject.success = false
                    responseObject.message = "Invalid Credentials"
                    res.status(401).json(responseObject)
                }
            })
        } else {
            logger.log('error', `Status: 404: User not found`)
            let responseObject = this.createResponseObject()
            responseObject.status = 404
            responseObject.success = false
            responseObject.message = "User not found"
            res.status(401).json(responseObject)
        }
    },

    //to create response object
    createResponseObject(data, token){
        let responseObject = {
            status: null,
            success: null,
            message: "",
            data: null
        }
        if(data != null){
            responseObject.data = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                token: token
            }
        }
        return responseObject
    },

    //to return user by email
    async returnUserByEmail(req, res) {
        try {
            const user = await userModel.find({email:req.body.email})
            return user
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //to return user by id
    async returnUserByID(req, res) {
        try {
            const user = await userModel.findById(req.params.id)
            if (user == null) {
                logger.log('error', `Status: 404: User not found`)
            }else{
                logger.log('info', `Status: 200: User found`)
                return user
            }
            
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //to save user
    async saveUser(user) {
        try{
            const savedUser = await user.save()
            logger.log('info', `Status: 200: Successfully signed up`)
            return savedUser
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //to delete user
    async removeUser (user) {
        try{
            await user.remove()
            logger.log('info', `Status: 200: Successfully deleted user`)
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },  

    //to create user object
    async createUser(req, res) {
        const encodedPassword = await bcrypt.hash(req.body.password, 10)
        const userObject = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: encodedPassword
        })
        if(res.user.length != 0) {
            logger.log('error', `Status: 422: User already exists`)
        }
        return userObject
    }
}

module.exports = userService