const notesController = require('../controllers/notesController')
const notesModel = require('../models/notesModel')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/notesLogger')

let notesService = {

    //to return all notes
    async returnAllNotes() {
        try {
            const allnotes = await notesModel.find();
            logger.log('info', `Status: 200: Successfully returned all notes`)
            return allnotes
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //to return note by title
    async returnNoteByTitle(req, res) {
        try {
            note = await notesModel.find({title:req.body.title})
            return note
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //to return note by id
    async returnNoteByID(req, res) {
        try {
            const note = await notesModel.findById(req.params.id)
            if (note == null) {
                logger.log('error', `Status: 404: Note not found`)
            }else{
                logger.log('info', `Status: 200: Note found`)
                return note
            }
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //to save note
    async saveNote(note, isUpdate) {
        try{
            const savedNote = await note.save()
            if(isUpdate){
                logger.log('info', `Status: 200: Note successfully updated`)
            }else{
                logger.log('info', `Status: 200: Note successfully added`)
            }
            return savedNote
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },

    //to delete user
    async removeNote(note) {
        try{
            await note.remove()
            logger.log('info', `Status: 200: Successfully deleted note`)
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
        }
    },  

    createNote(req, res) {
        const newNote = new notesModel({
            title: req.body.title,
            description: req.body.description,
        })
        this.validateTitleDescription()
        if(req.body.isPinned != null){
            newNote.isPinned = req.body.isPinned
            this.validateIsPinned()
        }
        if(req.body.isArchived != null){
            newNote.isArchived = req.body.isArchived
            this.validateIsArchived()
        }
        if(req.body.color != null){
            newNote.color = req.body.color
            this.validateColor()
        }
           // logger.log('error', `Status: 422: Note with same title already exists`)
        return newNote
    },

    //check if note with same title exists
    sameTitleExists(req, res) {
        if(res.notes.length != 0) {
            logger.log('error', `Status: 422: Note with same title already exists`)
            return true
        } else {
            res.note.title = req.body.title
            res.note.description = req.body.description
            res.note.isPinned = req.body.isPinned
            res.note.isArchived = req.body.isArchived
            res.note.color = req.body.color
            return false
        }
        
    },

    //isArchived validation function
    validateIsArchived(){
        return check("isArchived")
        .isBoolean()
        .withMessage("isArchived must be boolean")
    },

    //isPinned validation function
    validateIsPinned(){
        return check("isPinned")
        .isBoolean()
        .withMessage("isPinned must be boolean")
    },

    //color validation function
    validateColor(){
        return check("color")
        .isHexColor()
        .withMessage("color should be in hex")
    },

    //Validation rules
    validateTitleDescription() {
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
            .withMessage("Description should have atleast 3 characters")
        ]
    }
}

module.exports = notesService