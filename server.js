const express = require('express')
const connectDB = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');

const app = express()
console.log("express")
dotenv.config();
//console.log(`config ${process.env.MONGOURI}`)
connectDB(process.env.MONGOURI);

//Init Middleware
app.use(express.json({ extended: false}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => res.json({msg:'Welcome to the habits app..'}));

//Define Routes
app.use('/api/users', require('./routes/api/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT , () => `Server started on port ${PORT}`);