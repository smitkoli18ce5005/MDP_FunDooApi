const userModel = require('../models/userModel')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/userLogger')

let userController = {
    async getAllUsers(req, res) {
        try {
            const allUsers = await userModel.find();
            logger.log('info', `Status: ${res.statusCode}: Successfully returned all users`)
            return res.status(200).json(allUsers);
          } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
            return res.status(500).json({ message: error.messages });
          }
    },

    async getUserByCredentials(req, res) {
        try {
            const user = await userModel.find({email: req.body.email, password: req.body.password})
            if(user.length != 0) {
                logger.log('info', `Status: ${res.statusCode}: Successfully logged in`)
                return res.status(200).json(user)
            } else {
                logger.log('error', `Status: 404: User not found`)
                return res.status(404).json({message: "User not found"})
            }
        } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
            return res.status(500).json({ message: error.messages });
        }
    },

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

    async getUserByEmail(req, res, next){
        let user
        try{
            user = await userModel.find({email:req.body.email})
        } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
            return res.status(500).json({ message:error.message })
        }

        res.user = user
        next()
    },

    async addNewUser(req, res) {
        const newUser = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })

        if(res.user.length != 0) {
            logger.log('error', `Status: 422: User already exists`)
            res.status(422).json({message: "User already exists"})
        } else {
            try {
                const addedNewUser = await newUser.save()
                logger.log('info', `Status: ${res.statusCode}: Successfully signed up`)
                res.status(200).json(newUser)
            } catch (error) {
                logger.log('error', `Status: 400: ${error.message}`)
                res.status(400).json({ message: error.message })
            }
        }
    },

    async deleteUser(req, res) {
        try {
            await res.user.remove();
            logger.log('info', `Status: ${res.statusCode}: Successfully deleted user`)
            res.json({ message: "Deleted user" });
        } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
            res.status(500).json({ message: error.message });
        }
    },

    async getUserByID(req, res, next) {
        let user;
        try {
          user = await userModel.findById(req.params.id);
          if (user == null) {
            logger.log('error', `Status: 404: User not found`)
            return res.status(404).json({ message: "User not found" });
          }
        } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
          return res.status(500).json({ message: error.message });
        }
        
        res.user = user;
        next();
    }
}

module.exports = userController