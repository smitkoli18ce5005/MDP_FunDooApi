const express = require('express')
const notesRouter = express.Router()
const notesController = require('../controllers/notesController')

notesRouter.get('/getAllNotes', notesController.getAllnotes)

notesRouter.get('/getNote/:id', notesController.getNotesByID, notesController.displayNote)

notesRouter.get('/getAllArchivedNotes', notesController.getAllArchived)

notesRouter.get('/getAllTrashedNotes', notesController.getAllTrashedNotes)

notesRouter.delete('/deleteNote/:id', notesController.getNotesByID, notesController.deleteNote)

notesRouter.post('/addNotes', notesController.getNotesByTitle, notesController.addNewNote)

notesRouter.patch('/updateNote/:id', notesController.getNotesByID, notesController.getNotesByTitle, notesController.updateNote)

notesRouter.patch('/archiveNote/:id', notesController.archiveNote)

notesRouter.patch('/pinNote/:id', notesController.pinNote)

module.exports = notesRouter