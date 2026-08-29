const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
app.use(express.json());

const port = 3000;
app.get('/',(req,res)=>{
    res.send(`Hello from server ${process.env.NAME}`)
})
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
})