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

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const dash = require('./routes/dash')
app.use('/api/dash',dash)

const docnoe = require('./routes/doc')
app.use('/api/doc',docnoe)

//staff
const member = require('./routes/Staff/member')
app.use('/api/Staff/member',member)

const topic = require('./routes/Staff/topic')
app.use('/api/Staff/topic',topic)

const indicate = require('./routes/Staff/indicate')
app.use('/api/Staff/indicate',indicate)

const system = require('./routes/Staff/system')
app.use('/api/Staff/system',system)

const eva = require('./routes/Staff/eva')
app.use('/api/Staff/eva',eva)

const commit = require('./routes/Staff/commit')
app.use('/api/Staff/commit',commit)

const doc = require('./routes/Staff/doc')
app.use('/api/Staff/doc',doc)

//eva

const score_commit = require('./routes/Eva/score_commit')
app.use('/api/Eva/score_commit',score_commit)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

app.use((req,res)=> res.status(404).json({message:"Route not Found"}))
app.listen(3001,()=>{

    console.log("Server Running on Port 3001");
    

})