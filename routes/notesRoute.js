const express = require('express')
const notesRouter = express.Router()
const notesController = require('../controllers/notesController')

notesRouter.get('/', notesController.getAllnotes)

notesRouter.post('/addNotes', notesController.validationRules(), notesController.validateNotes, notesController.addNewNote)

module.exports = notesRouter