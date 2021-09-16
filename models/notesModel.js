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
        type: Boolean
    },
    "isArchived": {
        type: Boolean
    },
    "isDeleted": {
        type: Boolean
    },
    "color": {
        type: String
    }
})

module.exports = mongoose.model('notesModel', notesSchema)