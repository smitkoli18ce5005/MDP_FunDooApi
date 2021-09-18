const express = require('express')
const notesRouter = express.Router()
const notesController = require('../controllers/notesController')
const auth = require('../middleware/auth')

notesRouter.get('/getAllNotes', auth.verifyToken, notesController.getAllnotes)

notesRouter.get('/getNote/:id', auth.verifyToken, notesController.getNotesByID, notesController.displayNote)

notesRouter.get('/getAllArchivedNotes', auth.verifyToken, notesController.getAllArchived)

notesRouter.get('/getAllTrashedNotes', auth.verifyToken, notesController.getAllTrashedNotes)

notesRouter.delete('/deleteNote/:id', auth.verifyToken, notesController.getNotesByID, notesController.deleteNote)

notesRouter.post('/addNotes', auth.verifyToken, notesController.getNotesByTitle, notesController.addNewNote)

notesRouter.patch('/updateNote/:id', auth.verifyToken, notesController.getNotesByID, notesController.getNotesByTitle, notesController.updateNote)

notesRouter.patch('/archiveNote/:id', notesController.archiveNote)

notesRouter.patch('/pinNote/:id', notesController.pinNote)

module.exports = notesRouter