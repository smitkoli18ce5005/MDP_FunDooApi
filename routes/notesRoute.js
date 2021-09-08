const express = require('express')
const notesRouter = express.Router()
const notesController = require('../controllers/notesController')

notesRouter.get('/', notesController.getAllnotes)

notesRouter.post('/addNotes', notesController.validationRules(), notesController.validateNotes, notesController.getNotesByTitle, notesController.addNewNote)

notesRouter.delete('/:id', notesController.getNotesByID, notesController.deleteNote)

notesRouter.patch('/:id', notesController.validationRules(), notesController.validateNotes, notesController.getNotesByID, notesController.getNotesByTitle, notesController.updateNote)

module.exports = notesRouter