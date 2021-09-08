const userService = require('../services/userService')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/userLogger')

let userController = {

    //to return all users
    async getAllUsers(req, res) {
        try {
            const allUsers = await userService.returnAllUsers()
            res.status(200).json(allUsers)
          } catch (error) {   
            res.status(500).json({ message: error.messages })
          }
    },

    //to return user by credentials (email and password)
    async getUserByCredentials(req, res) {
        try {
            const user = await userService.returnUserByCredentials(req, res)
            if(user.length != 0) {
                res.status(200).json(user)
            } else {
                res.status(404).json({message: "User not found"})
            }
        } catch (error) {
            res.status(500).json({ message: error.messages });
        }
    },

    //Validation rules
    validationRules(){
        return userService.returnValidationRules()
    },

    //to validate user
    validateUser(req, res, next) {
        const errors = validationResult(req)

        if(errors.isEmpty()){
            logger.log('info', `Status: ${res.statusCode}: Entered data is valid`)
            next()
        } else{
            const extractedErrors = []
            errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
            logger.log('error', `Status: 422: ${extractedErrors}`)
            return res.status(422).json({message: extractedErrors})
        } 
    },

    //to return user by email
    async getUserByEmail(req, res, next){
        let user
        try{
            user = await userService.returnUserByEmail(req, res)
        } catch (error) {
            return res.status(500).json({ message:error.message })
        }
        res.user = user
        next()
    },

    //to add new user
    async addNewUser(req, res) {
        const newUser = userService.createUser(req, res)

        if(res.user.length != 0) {     
            res.status(422).json({message: "User already exists"})
        } else {
            try {
                const addedNewUser = await userService.saveUser(newUser)
                res.status(200).json(addedNewUser)
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        }
    },

    //to delete user
    async deleteUser(req, res) {
        try {
            await userService.removeUser(res.user)
            res.json({ message: "Deleted user" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //to return user by id
    async getUserByID(req, res, next) {
        let user;
        try {
          user = await userService.returnUserByID(req, res)
          if (user == null) {
            return res.status(404).json({ message: "User not found" });
          }
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
        res.user = user;
        next();
    },

    displayUser(req, res) {
        if(res.user.length != 0){
            res.status(200).json(res.user)
        }
    }
}

module.exports = userController