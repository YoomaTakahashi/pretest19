const express = require('express')
const db = require('../db')
const router = express.Router()
const {verifyToken} = require('../middleware/authmiddleware')

router.get('/',async(req,res)=>{
    try {
        const [rows] = await db.query(`select * from tb_doc where id_doc`)
        res.json(rows)
    } catch (error) {
        console.error('Error get doc')
        res.status(500).json({message:'Error get doc'})
    }
})
module.exports =router