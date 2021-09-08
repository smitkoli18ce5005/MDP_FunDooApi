const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    "title": {
        type: String,
        required: true
    },
    "description": {
        type: String,
        required: true
    },
    "isPinned": {
        type: Boolean,
        required: true,
        default: false
    },
    "isArchived": {
        type: Boolean,
        required: true,
        default: false
    },
    "color": {
        type: String,
        required: true,
        default: "#FFFFFF"
    }
})

module.exports = mongoose.model('notesModel', notesSchema)