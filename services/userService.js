require('dotenv').config()
const userModel = require('../models/userModel')
const logger = require('../logger/userLogger')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { json } = require('express')

let userService = {

    //to return all users
    async getAllUsersService(req, res) {
        try {
            const allUsers = await userModel.find();
            if(allUsers.length > 0) {
                logger.log('info', `Status: 200: Successfully returned all users`)
                res.status(200).json(this.createResponseObject(200, true, "Successfully returned all users", allUsers))
            } else {
                logger.log('error', `Status: 404: No users found`)
                res.status(200).json(this.createResponseObject(404, false, "No users found"))
            }
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    //service for login
    async loginService(req, res){
        try{
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
                        res.status(200).json(this.createResponseObject(200, true, "Successfully logged in", user[0], token))
                    } else {
                        logger.log('error', `Status: 401: Invalid Credentials`)
                        res.status(401).json(this.createResponseObject(401, false, "Invalid Credentials"))
                    }
                })
            } else {
                logger.log('error', `Status: 404: User not found`)
                res.status(401).json(this.createResponseObject(404, false, "User not found"))
            }
        } catch(error) {
            logger.log('error', `Status: 500: ${error.message}`)
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    //to create response object for data
    createResponseObject(status, success, message, data, token){
        let responseObject = {
            status,
            success,
            message,
            data: null
        }
        if(data != null){
            responseObject.data = data
        }else{
            responseObject = {
                status,
                success,
                message
            }
        }
        if(data != null && token != null){
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
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    //to return user by id
    async returnUserByID(req, res) {
        try { 
            const user = await userModel.findById(req.params.id)
            if (user == null) {   
                logger.log('error', `Status: 404: User not found`)
                res.status(404).json(this.createResponseObject(404, false, "User not found"))
            } else {
                logger.log('info', `Status: 200: User found`)
                return user
            }
        } catch (error) {
            logger.log('error', `Status: 404: User not found`)
                res.status(404).json(this.createResponseObject(404, false, "User not found"))
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
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    //to delete user
    async removeUser (req, res) {
        try{
            const deletedUser = await res.user.remove()
            logger.log('info', `Status: 200: Successfully deleted user`)
            res.status(200).json(this.createResponseObject(200, true, "Successfully deleted user", deletedUser))
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },  

    //to create user object
    async createUser(req, res) {
        try{
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
        }catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    //to send reset password mail
    sendResetMail(req, res){
        try{
            const token = jwt.sign({email: res.user[0].email, id: res.user[0]._id}, process.env.TOKEN_KEY)
            const transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                    user: process.env.SENDER_MAIL,
                    pass: process.env.SENDER_PASSWORD
                }
            })
            const options = {
                from: process.env.SENDER_MAIL,
                to: process.env.RECEIVER_MAIL,
                subject: process.env.MAIL_SUBJECT,
                html: '<p>Click <a href="' + process.env.RESET_LINK + token + '">here</a> to reset your password</p>'
            }
            transporter.sendMail(options, (error, info) => {
                if(error) {
                    res.status(502).json(this.createResponseObject(502, false, "Failed to sent mail"))
                } else {
                    res.status(200).json(this.createResponseObject(200, true, "Successfully sent mail"))
                } 
            })
        } catch(error) {
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }  
    },

    //to update password
    async updatePassword(req, res){
        try{
            let user = await userModel.findById(res.userID.id)
            user.password =  await bcrypt.hash(req.body.password, 10)
            const updatetUser = await user.save()
            res.status(200).json(this.createResponseObject(200, true, "Successfully updated password", updatetUser))
        } catch(error){
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }  
    }
}

module.exports = userService