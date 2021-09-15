const userService = require('../services/userService')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/userLogger')

let userController = {

    //to return all users
    async getAllUsers(req, res) {
        try {
            await userService.getAllUsersService(req, res)
          } catch (error) {   
            res.status(500).json({ message: error.messages })
          }
    },

    //for login
    async loginUser(req, res){
        try{
            await userService.loginService(req, res)
        } catch (error) {
            res.status(500).json({ message: error.messages });
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
        const newUser = await userService.createUser(req, res)

        if(res.user.length != 0) {     
            res.status(422).json({message: "User already exists"})
        } else {
            try {
                const addedNewUser = await userService.saveUser(newUser)
                res.status(200).json({message: "User successfully registered"})
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
            logger.log('error', `Status: 404: User not found`)
            let responseObject = userService.createResponseObject()
            responseObject.status = 404
            responseObject.success = false
            responseObject.message = "User not found"
            res.status(404).json(responseObject)
          } else {
            res.user = user;
            next();
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    },

    displayUser(req, res) {
        if(res.user.length != 0){
            logger.log('info', `Status: 200: Successfully returned user`)
            let responseObject = userService.createResponseObject()
            responseObject.status = 200
            responseObject.success = true
            responseObject.message = "Successfully returned user"
            responseObject.data = res.user
            res.status(200).json(responseObject)
        }
    }
}

module.exports = userController