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
        default: false
    },
    "isArchived": {
        type: Boolean,
        default: false
    },
    "isDeleted": {
        type: Boolean,
        default: false
    },
    "color": {
        type: String,
        default: "#FFFFFF"
    }
})

module.exports = mongoose.model('notesModel', notesSchema)