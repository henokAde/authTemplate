import express from 'express'
import cors from 'cors'
import fs from "fs";
import mongoose from 'mongoose';
import csrf from 'csurf';
import cookieParser from 'cookie-parser'
const morgan = require("morgan");
require('dotenv').config();


const csrfProtection = csrf({cookie:true})
// Create express app 
const app = express();

//db connexion 
mongoose.connect(process.env.DATABASE, {
    // userNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
    // useCreateIndex : true,
}).then(() =>{
    console.log("db connected")
}).catch((err) =>{
    console.log('db connection error', err);
});

// apply middlewares 
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


//Route 
fs.readdirSync('./routes').map((r) => 
app.use('/api', require(`./routes/${r}`)));

//csrf
app.use(csrfProtection);
app.get('/api/csrf-token', (req, res) =>{
    res.json({csrfToken: req.csrfToken()})
})

// port 
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server is runing on port '));