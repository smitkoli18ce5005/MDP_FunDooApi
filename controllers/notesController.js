const notesService = require('../services/notesService')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/notesLogger')

let notesController = {
    async getAllnotes(req, res) {
        try {
            const allUsers = await notesService.returnAllNotes()
            res.status(200).json(allUsers);
          } catch (error) {
            res.status(500).json({ message: error.messages });
          }
    },

    validationRules(){
        return notesService.returnValidationRules()
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
            res.status(422).json({message: extractedErrors})
        }
    },

    async getNotesByTitle(req, res, next){
        let notes
        try{
            notes = await notesService.returnNoteByTitle(req, res)
        } catch (error) {
            res.status(500).json({ message:error.message })
        }
        res.notes = notes
        next()
    },

    async addNewNote(req, res) {
        const newNote = notesService.createNote(req, res)
        if(res.notes.length != 0) {
            res.status(422).json({message: "Note with same title already exists"})
        } else {
            try {
                const addedNewNote = await notesService.saveNote(newNote, false)
                res.status(200).json(addedNewNote)
            } catch (error) {
                res.status(400).json({ message: error.message })
            }
        }
    },

    async deleteNote(req, res) {
        try {
            await notesService.removeNote(res.note)
            res.json({ message: "Deleted note" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateNote(req, res) {
        if(notesService.sameTitleExists(req, res)){
            res.status(422).json({message: "Note with same title already exists"})
        } else {
            try {
                const updatedNote = await notesService.saveNote(res.note, true)
                res.status(200).json(updatedNote)
            } catch (error) {
                res.status(400).json({ message: error.message })
            }
        }
    },

    async getNotesByID(req, res, next) {
        let note;
        try {
          note = await notesService.returnNoteByID(req, res)
          if (note == null) {
            return res.status(404).json({ message: "Note not found" });
          }
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
        res.note = note;
        next();
    },

    displayNote(req, res) {
        if(res.note.length != 0){
            res.status(200).json(res.note)
        }
    }
}

module.exports = notesController