require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('mongoose')

const logger = require('./logger/funDooAPILogger')

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const funDooAPIDocument = YAML.load('./api_docs/docs.yaml');

app.use('/fundooapi/api-docs', swaggerUi.serve, swaggerUi.setup(funDooAPIDocument));

mongoose.connect(process.env.USER_DATABASE_URI)
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => {
    logger.log('info', 'Connected to database')
    console.log('Connected to database')
})

app.use(express.json())
const userRoute = require('./routes/userRoute')
app.use('/user', userRoute)

const notesRoute = require('./routes/notesRoute')
app.use('/notes', notesRoute)

app.listen(process.env.PORT, () => {
    logger.log('info', `Server started at port ${process.env.PORT}!`)
    console.log(`Server started at port ${process.env.PORT}!`)
})