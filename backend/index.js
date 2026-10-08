
require('dotenv').config({path:'.env'})
const path = require('path')
const express = require('express')
const cors = require('cors')
const fileUp = require('express-fileupload')
const app = express()

app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}))

app.use(express.json())
app.use(fileUp())
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))

app.use((req,res)=> res.status(404).json({message:"Route not Found"}))
app.listen(3001,()=>{

    console.log("Server Running on Port 3001");
    

})