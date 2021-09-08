const userModel = require('../models/userModel')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/userLogger')

let userService = {

    //to return all users
    async returnAllUsers() {
        try {
            const allUsers = await userModel.find();
            logger.log('info', `Status: 200: Successfully returned all users`)
            return allUsers
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //to return user by credentials (email and password)
    async returnUserByCredentials (req, res){
        try {
            const user = await userModel.find({email: req.body.email, password: req.body.password})
            if(user.length != 0) {
                logger.log('info', `Status: 200: Successfully logged in`)
                return user
            } else {
                logger.log('error', `Status: 404: User not found`)
            }
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
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
    createUser(req, res) {
        const newUser = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        if(res.user.length != 0) {
            logger.log('error', `Status: 422: User already exists`)
        }
        return newUser
    },

    //Validation rules
    returnValidationRules() {
        return [
            check("firstName")
            .not().isEmpty()
            .withMessage("First Name is required")
            .isAlpha()
            .withMessage("First Name should only contain alphabetical characters")
            .isLength({min:3})
            .withMessage("First Name should atleast have 3 characters"),
    
            check("lastName")
            .not().isEmpty()
            .withMessage("Last Name is required")
            .isAlpha()
            .withMessage("Last Name should only contain alphabetical characters")
            .isLength({min:3})
            .withMessage("Last Name should atleast have 3 characters"),
    
            check("email")
            .isEmail()
            .withMessage("Please enter a valid Email-ID"),
    
            check("password")
            .isLength({min:3})
            .withMessage("Password must have atleast 3 characters")
        ]
    }
}

module.exports = userService