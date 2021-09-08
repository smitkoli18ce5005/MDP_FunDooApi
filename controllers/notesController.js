const notesModel = require('../models/notesModel')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/notesLogger')

let notesController = {
    async getAllnotes(req, res) {
        try {
            const allUsers = await notesModel.find();
            logger.log('info', `Status: ${res.statusCode}: Successfully returned all notes`)
            return res.status(200).json(allUsers);
          } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
            return res.status(500).json({ message: error.messages });
          }
    },

    validationRules(){
        return [
            check("title")
            .not().isEmpty()
            .withMessage("Title is required")
            .isLength({min:3})
            .withMessage("Title should have atleast 3 characters"),

            check("description")
            .not().isEmpty()
            .withMessage("Description is required"),

            check("isPinned")
            .isBoolean()
            .withMessage("isPinned must be boolean"),

            check("isArchived")
            .isBoolean()
            .withMessage("isArchived must be boolean"),

            check("color")
            .isHexColor()
            .withMessage("color should be in hex"),

        ]
    },

    validateNotes(req, res, next) {
        const errors = validationResult(req)

        if(errors.length != 0){
            logger.log('info', `Status: ${res.statusCode}: Entered data is valid`)
            next()
        } else {
            logger.log('error', `Status: 422: ${errors}`)
            return res.json(errors)
        }
    },

    async getNotesByTitle(req, res, next){
        let user
        try{
            notes = await notesModel.find({title:req.body.title})
        } catch (err) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
            return res.status(500).json({ message:err.message })
        }

        res.notes = notes
        next()
    },

    async addNewNote(req, res) {
        const newNote = new notesModel({
            title: req.body.title,
            description: req.body.description,
            isPinned: req.body.isPinned,
            isArchived: req.body.isArchived,
            color: req.body.color
        })

        if(res.notes.length != 0) {
            logger.log('error', `Status: 422: Note with same title already exists`)
            res.status(422).json({message: "Note with same title already exists"})
        } else {
            try {
                const addedNewNote = await newNote.save()
                logger.log('info', `Status: ${res.statusCode}: Note successfully added`)
                res.status(200).json(newNote)
            } catch (error) {
                logger.log('error', `Status: 400: ${error.message}`)
                res.status(400).json({ message: error.message })
            }
        }
    }
}

module.exports = notesController