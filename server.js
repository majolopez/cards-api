const express = require('express')
const connectDB = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');

const app = express()

dotenv.config();

connectDB(process.env.MONGOURI);

app.get('/', (req, res) => res.json({msg:'Welcome to the habits app..'}));

const PORT = process.env.PORT || 5000;
app.listen(PORT , () => `Server started on port ${PORT}`);