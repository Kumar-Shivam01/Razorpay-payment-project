const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const port = 3000;
const app = express();
mongoose.connect(process.env.MONGODB_CONN_STR)
app.use(express.json());

app.get('/',(req,res)=>{
    res.send(`Hello from server ${process.env.NAME}`)
})
const connectServer = async()=>{
    try{
         await mongoose.connect(process.env.MONGODB_CONN_STR)
         console.log('DB connection successfull!')
         app.listen(port,()=>{
            console.log(`Server running at http://localhost:${port}`)
         })
    }catch(err){
        console.log(`DB connection failed: ${err}`)
    }
}

connectServer()
