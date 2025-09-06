const mongoose = require('mongoose')

const express = require("express");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
