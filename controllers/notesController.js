const notesService = require('../services/notesService')
const {check, validationResult} = require('express-validator')
const logger = require('../logger/notesLogger')

let notesController = {
    async getAllnotes(req, res) {
        try {
            await notesService.returnAllNotes(req, res)
          } catch (error) {
            res.status(500).json(notesService.createResponseObject(500, false, "Server side error", error.message))
          }
    },

    async getNotesByTitle(req, res, next){
        let notes
        try{
            notes = await notesService.returnNoteByTitle(req, res)
        } catch (error) {
            res.status(500).json(notesService.createResponseObject(500, false, "Server side error", error.message))
        }
        res.noteExists = notes
        next()
    },

    async addNewNote(req, res) {
        notesService.createNote(req, res)
        if(res.noteExists.length != 0) {
            res.status(422).json(notesService.createResponseObject(422, false, "Note with same title already exists"))
        } else {
            try {
                const addedNewNote = await notesService.saveNote(res.note, false)
                res.status(200).json(notesService.createResponseObject(200, true, "Note successfully added", addedNewNote))
            } catch (error) {
                res.status(500).json(notesService.createResponseObject(500, false, "Server side error", error.message))
            }
        }
    },

    async deleteNote(req, res) {
        try {
            if(res.note != null){
                await notesService.removeNote(res.note)
                res.status(200).json(notesService.createResponseObject(200, true, "Deleted note", res.note))
            }
        } catch (error) {
            res.status(500).json(notesService.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    async updateNote(req, res) {
        if(res.noteExists.length != 0) {
            res.status(422).json(notesService.createResponseObject(422, false, "Note with same title already exists"))
        } else {
            try {
                notesService.createUpdatedNote(req, res)
                const updatedNote = await notesService.saveNote(res.note, true)
                res.status(200).json(notesService.createResponseObject(200, true, "Note successfully updated", updatedNote))
            } catch (error) {
                res.status(500).json(notesService.createResponseObject(500, false, "Server side error", error.message))
            }
        }
    },

    async getNotesByID(req, res, next) {
        let note;
        try {
          res.note = await notesService.returnNoteByID(req, res)
        } catch (error) {
            res.status(500).json(notesService.createResponseObject(500, false, "Server side error", error.message))
        }
        next();
    },

    displayNote(req, res) {
        if(res.note != null){
            res.status(200).json(notesService.createResponseObject(200, true, "Successfully returned note", res.note))
        }
    }
}

module.exports = notesController