const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const { default: mongoose } = require('mongoose');

app.use(cors());

connectToMongo();

// to use req.body
app.use(express.json());

// https://evalleyhackathon.herokuapp.com/

app.use('/api/auth', require('./routes/auth.js'));

app.use('/api', require('./routes/area-page.js'));

const PORT = process.env.PORT || 5000;

// This may be the solution the that major problem
const API = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com/' : 'http://localhost:5000/';

// step 3 : heroku
if(process.env.NODE_ENV == "production" || process.env.NODE_ENV == "staging"){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(PORT, ()=>{
    console.log('Listening at port ',PORT);
})
