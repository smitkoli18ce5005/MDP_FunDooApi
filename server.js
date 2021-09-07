require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoute')

const app = express()

mongoose.connect(process.env.USER_DATABASE_URI)
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'))

app.use(express.json())
app.use('/user', userRoute)

app.listen(2000, () => console.log("Server started at port 2000!"))