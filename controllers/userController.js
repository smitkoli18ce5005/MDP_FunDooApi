const userService = require('../services/userService')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/userLogger')
const jwt = require('jsonwebtoken')

let userController = {

    //to return all users
    async getAllUsers(req, res) {
        try {
            await userService.getAllUsersService(req, res)
          } catch (error) {  
            // 503 - Service Unavailable.
            res.status(503).json(userService.createResponseObject(503, false, "Service Unavailable"))
          }
    },

    //for user login
    async loginUser(req, res){
        try{
            await userService.loginService(req, res)
        } catch (error) {
            res.status(503).json(userService.createResponseObject(503, false, "Service Unavailable"))
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

    //to return validation errors
    returnValidationErrors(req, res, next) {
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
            res.status(503).json(userService.createResponseObject(503, false, "Service Unavailable"))
        }
        res.user = user
        next()
    },

    //to add new user
    async addNewUser(req, res) {
        const newUser = await userService.createUser(req, res)

        if(res.user.length != 0) {     
            res.status(422).json(userService.createResponseObject(422, false, "User already exists"))
        } else {
            try {
                await userService.saveUser(newUser)
                res.status(200).json(userService.createResponseObject(200, true, "User successfully registered"))
            } catch (error) {
                res.status(503).json(userService.createResponseObject(503, false, "Service Unavailable"))
            }
        }
    },

    //to delete user
    async deleteUser(req, res) {
        try {
            await userService.removeUser(req, res)
        } catch (error) {
            res.status(503).json(userService.createResponseObject(503, false, "Service Unavailable", error.message))
        }
    },

    //to return user by id
    async getUserByID(req, res, next) {
        let user;
        try {
            user = await userService.returnUserByID(req, res)
            if(user != null){
                res.user = user;
                next();
            }
        } catch (error) {
            res.status(503).json(userService.createResponseObject(503, false, "Service Unavailable"))
        }
    },

    //to display user
    displayUser(req, res) {
        if(res.user.length != 0){
            logger.log('info', `Status: 200: Successfully returned user`)
            let responseObject = userService.createResponseObject(200, true, "Successfully returned user", res.user)
            res.status(200).json(responseObject)
        }
    },

    //to send email
    forgetPassword(req, res){
        try{
            userService.sendResetMail(req, res)
        }catch(error){
            res.status(503).json(userService.createResponseObject(503, false, "Service Unavailable"))
        }
    },
    
    validatePassword(req, res, next){
        if(req.body.password == undefined){
            res.status(422).json(userService.createResponseObject(422, false, "Provide password in body"))
        } else if(req.body.password.length < 3){
            res.status(422).json(userService.createResponseObject(422, false, "Password must have atleast 3 characters"))
        } else{
            next()
        }
    },

    //verify token
    verifyToken(req, res, next){
        jwt.verify(req.params.token, process.env.TOKEN_KEY, (error, userID) => {
            if (error) {
              res.status(403).json({
                status: 403,
                success: false,
                message: "Invalid Token",
              });
            }
            res.userID = userID
            next()
        })
    },

    //to reset password
    async resetPassword(req, res){
        try{
            await userService.updatePassword(req, res)
        }catch(error){
            res.status(503).json(userService.createResponseObject(503, false, "Service Unavailable"))
        }
        
    }
}

module.exports = userController