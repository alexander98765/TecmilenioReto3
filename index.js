const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { specs, swaggerUi } = require('./swagger');

const app = express();

app.use(express.json());

const mongoString = process.env.DATABASE_URL

console.log("uri " + mongoString)

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


const authRouter = require("./routes/auth");
const restaurantsRouter = require("./routes/restaurants");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");
app.use("/auth", authRouter)
app.use("/restaurants", restaurantsRouter)
app.use("/users", usersRouter)
app.use("/comments", commentsRouter)

app.use('/api', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})