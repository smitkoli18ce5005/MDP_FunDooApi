const notesModel = require('../models/notesModel')
const logger = require('../logger/notesLogger')

let notesService = {

    //to return all notes
    async returnAllNotes(req, res) {
        try {
            const allnotes = await notesModel.find()
            logger.log('info', `Status: 200: Successfully returned all notes`)
            res.status(200).json(this.createResponseObject(200, true, "Successfully returned all notes", allnotes))
        } catch (error) {
            logger.log('error', `Status: 500: ${error.message}`)
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    //to return all archived notes
    async returnAllArchivedNotes(req, res){
        try{
            const allArchivednotes = await notesModel.find({isArchived: true})
            logger.log('info', `Status: 200: Successfully returned all archived notes`)
            res.status(200).json(this.createResponseObject(200, true, "Successfully returned all archived notes", allArchivednotes))
        } catch(error){
            logger.log('error', `Status: 500: ${error.message}`)
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    //to return all trashed notes
    async returnAllTrashedNotes(req, res){
        try{
            const allTrashednotes = await notesModel.find({isDeleted: true})
            logger.log('info', `Status: 200: Successfully returned all trashed notes`)
            res.status(200).json(this.createResponseObject(200, true, "Successfully returned all trashed notes", allTrashednotes))
        } catch(error){
            logger.log('error', `Status: 500: ${error.message}`)
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    // to toggle archive
    async toggleArchive(req, res){
        try{
            let note = await notesModel.findById(req.params.id)
            note.isArchived = !note.isArchived
            await note.save()
            logger.log('info', `Status: 200: Note successfully archived`)
            res.status(200).json(this.createResponseObject(200, true, "Note successfully archived", note))
        } catch (error){
            logger.log('error', `Status: 500: ${error.message}`)
            res.status(500).json(this.createResponseObject(500, false, "Server side error", error.message))
        }
    },

    //to return note by id
    async returnNoteByID(req, res) {
        try {
            const note = await notesModel.findById(req.params.id)
            if (note == null) {
                logger.log('error', `Status: 404: Note not found`)
                res.status(404).json(this.createResponseObject(404, false, "Note not found"))
            }else{
                logger.log('info', `Status: 200: Note found`)
                return note
            }
        } catch (error) {
            logger.log('error', `Status: 404: ${error.message}`)
            res.status(404).json(this.createResponseObject(404, false, "Note not found"))
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

    //to create updated note object
    createUpdatedNote(req, res) {
        res.note.title = req.body.title
        res.note.description = req.body.description
        res.note.isPinned = req.body.isPinned != null ? req.body.isPinned : res.note.isPinned
        res.note.isArchived = req.body.isArchived != null ? req.body.isArchived : res.note.isArchived
        res.note.isDeleted = req.body.isDeleted != null ? req.body.isDeleted : res.note.isDeleted
        res.note.color = req.body.color ||  res.note.color
    },

    //to create new note object
    createNote(req, res) {
        let errors = []
        let newNote = new notesModel({
            title: null,
            description: null,
            isPinned: null,
            isArchived: null,
            isDeleted: null,
            color: null
        })
        if(req.body.title != null){
            if(req.body.title.length > 3){
                newNote.title = req.body.title
            } else {
                errors.push({"title": "title should have atleast 3 characters"})  
            }
        } else {
            errors.push({"title": "title is required"})  
        }
        if(req.body.description != null){
            if(req.body.description.length > 3){
                newNote.description = req.body.description
            } else {
                errors.push({"description": "description should have atleast 3 characters"})  
            }
        } else {
            errors.push({"description": "description is required"})  
        }

        if(req.body.isPinned != null){
            if(typeof req.body.isPinned == "boolean"){
                newNote.isPinned = req.body.isPinned
            } else {
                errors.push({"isPinned": "isPinned should be boolean"})                
            }
        }else {
            newNote.isPinned = false
        }
        if(req.body.isArchived != null){
            if(typeof req.body.isArchived == "boolean"){
                newNote.isArchived = req.body.isArchived
            } else {
                errors.push({"isArchived": "isArchived should be boolean"})                
            }
        }else {
            newNote.isArchived = false
        }
        if(req.body.isDeleted != null){
            if(typeof req.body.isDeleted == "boolean"){
                newNote.isDeleted = req.body.isDeleted
            } else {
                errors.push({"isDeleted": "isDeleted should be boolean"})                
            }
        }else {
            newNote.isDeleted = false
        }

        if(req.body.color != null){
            let reg = /^#([0-9A-F]{3}){1,2}$/i
            if(reg.test(req.body.color)){
                newNote.color = req.body.color
            } else{
                errors.push({"color": "color should be in hex format"})    
            }
        }else {
            newNote.color = "#ffffff"
        }

        if(errors.length == 0){
            res.note = newNote
        }else{
            res.status(422).json(this.createResponseObject(422, false, "Invalid data", errors))
        }
    },

    //to create response object for data
    createResponseObject(status, success, message, data, token){
        let responseObject = {
            status,
            success,
            message,
            data: null
        }
        if(data != null){
            responseObject.data = data
        }else{
            responseObject = {
                status,
                success,
                message
            }
        }
        if(data != null && token != null){
            responseObject.data = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                token: token
            }
        }
        return responseObject
    }
}

module.exports = notesService