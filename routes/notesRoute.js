const express = require('express')
const notesRouter = express.Router()
const notesController = require('../controllers/notesController')

notesRouter.get('/getAllNotes', notesController.getAllnotes)

notesRouter.get('/getNotes/:id', notesController.getNotesByID, notesController.displayNote)

notesRouter.post('/addNotes', notesController.validationRules(), notesController.validateNotes, notesController.getNotesByTitle, notesController.addNewNote)

notesRouter.delete('/deleteNote/:id', notesController.getNotesByID, notesController.deleteNote)

notesRouter.patch('/updateNote/:id', notesController.validationRules(), notesController.validateNotes, notesController.getNotesByID, notesController.getNotesByTitle, notesController.updateNote)

module.exports = notesRouter