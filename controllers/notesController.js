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
            .withMessage("Description is required")
            .isLength({min:3})
            .withMessage("Description should have atleast 3 characters"),

            check("isPinned")
            .not().isEmpty()
            .withMessage("isPinned is required")
            .isBoolean()
            .withMessage("isPinned must be boolean"),

            check("isArchived")
            .not().isEmpty()
            .withMessage("isArchived is required")
            .isBoolean()
            .withMessage("isArchived must be boolean"),

            check("color")
            .not().isEmpty()
            .withMessage("color is required")
            .isHexColor()
            .withMessage("color should be in hex")
        ]
    },

    validateNotes(req, res, next) {
        const errors = validationResult(req)

        if(errors.isEmpty()){
            logger.log('info', `Status: ${res.statusCode}: Entered data is valid`)
            next()
        } else {
            const extractedErrors = []
            errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
            logger.log('error', `Status: 422: ${extractedErrors}`)
            return res.status(422).json({message: extractedErrors})
        }
    },

    async getNotesByTitle(req, res, next){
        let notes
        try{
            notes = await notesModel.find({title:req.body.title})
        } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
            return res.status(500).json({ message:error.message })
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
                res.status(200).json(addedNewNote)
            } catch (error) {
                logger.log('error', `Status: 400: ${error.message}`)
                res.status(400).json({ message: error.message })
            }
        }
    },

    async deleteNote(req, res) {
        try {
            await res.note.remove();
            logger.log('info', `Status: ${res.statusCode}: Successfully deleted note`)
            res.json({ message: "Deleted note" });
        } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
            res.status(500).json({ message: error.message });
        }
    },

    async updateNote(req, res) {
        if(res.notes.length != 0) {
            logger.log('error', `Status: 422: Note with same title already exists`)
            res.status(422).json({message: "Note with same title already exists"})
        } else {
            res.note.title = req.body.title
            res.note.description = req.body.description
            res.note.isPinned = req.body.isPinned
            res.note.isArchived = req.body.isArchived
            res.note.color = req.body.color
            try {
                const updatedNote = await res.note.save()
                logger.log('info', `Status: ${res.statusCode}: Note successfully updated`)
                res.status(200).json(updatedNote)
            } catch (error) {
                logger.log('error', `Status: 400: ${error.message}`)
                res.status(400).json({ message: error.message })
            }
        }
    },

    async getNotesByID(req, res, next) {
        let note;
        try {
          note = await notesModel.findById(req.params.id);
          if (note == null) {
            logger.log('error', `Status: 404: Note not found`)
            return res.status(404).json({ message: "Note not found" });
          }
        } catch (error) {
            logger.log('error', `Status: ${res.statusCode}: ${error.message}`)
          return res.status(500).json({ message: error.message });
        }
        
        res.note = note;
        next();
    }
}

module.exports = notesController