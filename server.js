require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('mongoose')
const userRoute = require('./routes/userRoute')
const logger = require('./logs/userLogger')

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api_docs/userDocs.yaml');

app.use('/user/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



mongoose.connect(process.env.USER_DATABASE_URI)
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => {
    logger.log('info', 'Connected to database')
    console.log('Connected to database')
})

app.use(express.json())
app.use('/user', userRoute)

app.listen(process.env.PORT, () => {
    logger.log('info', `Server started at port ${process.env.PORT}!`)
    console.log(`Server started at port ${process.env.PORT}!`)
})