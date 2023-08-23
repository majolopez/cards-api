const express = require('express')
const connectDB = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');
var cors = require('cors')

const app = express()
console.log("express")
dotenv.config();

connectDB(process.env.MONGOURI);
app.use(cors({ origin: process.env.UIURL}))

//Init Middleware
app.use(express.json({ extended: false}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.MONGOURI); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => res.json({msg:'Welcome to the habits app..'}));

//Define Routes
app.use('/api/cards', require('./routes/api/cards'));
app.use('/api/categories', require('./routes/api/categories'));

const PORT = process.env.PORT || 49160;
app.listen(PORT , () => `Server started on port ${PORT}`);
