const userModel = require('../models/userModel')
const {check, validationResult} = require('express-validator')

let userController = {
    async getAllUsers(req, res) {
        try {
            const allUsers = await userModel.find();
            return res.status(201).json(allUsers);
          } catch (error) {
            return res.status(500).json({ message: error.messages });
          }
    },

    async getUserByCredentials(req, res) {
        try {
            const user = await userModel.find({email: req.body.email, password: req.body.password})
            if(user.length != 0) {
                return res.status(201).json(user.length)
            } else {
                return res.status(404).json({message: "User not found"})
            }
        } catch (error) {
            return res.status(500).json({ message: error.messages });
        }
    },

    async validateUser(req, res) {
        res.json({message:"hello"})
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
            .withMessage("Password must have atleast 3 characters"),
        ]
    },

    validateUser(req, res, next) {
        const errors = validationResult(req)

        if(errors.length != 0){
            next()
        } else {
            return res.json(errors)
        }
    },

    async getUserByEmail(req, res, next){
        let user
        try{
            user = await userModel.find({email:req.body.email})
        } catch (err) {
            return res.status(500).json({ message:err.message })
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
            res.status(422).json({message: "User already exists"})
        } else {
            try {
                const addedNewUser = await newUser.save()
                res.status(201).json(newUser)
            } catch (error) {
                res.status(400).json({ message: err.message })
            }
        }
    },

    async deleteUser(req, res) {
        try {
            await res.user.remove();
            res.json({ message: "Deleted user" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getUserByID(req, res, next) {
        let user;
        try {
          user = await userModel.findById(req.params.id);
          if (user == null) {
            return res.status(404).json({ message: "User not found" });
          }
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
        res.user = user;
        next();
    }
}

module.exports = userController