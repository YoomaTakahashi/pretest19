const express =require('express')
const db =require('../../db')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/signature')
const router = express.Router()
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.get('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("Error GET User",err)
        res.status(500).json({message:'Error GET User'})
    }
})

router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async(req,res)=>{
    try {
        const id_member =req.user.id_member
        const id_eva = req.params.id_eva
        const file =req.files?.file
        const filename = Date.now()+path.extname(file.name)
        await file.mv(path.join(uploadDir,filename))
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=? `,[filename,id_eva,id_member])
        const [SumCommit] = await db.query(`select * from tb_commit where status_commit=? and signature!='${null}' and id_eva=?`,['y',id_eva])
        if(SumCommit.length === 3){
            await db.query(`update tb_eva set status_eva=? where id_eva=?`,[3,id_eva])
        }
        res.status(201).json({message:'Uploads Success!!!!'})
    } catch (error) {
                console.error("Error Uploads",err)
        res.status(500).json({message:'Error Uploads'})
    }
})

router.delete('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[d]] = await db.query(`select signature from tb_commit where id_eva=? and id_member=? `,[id_eva,id_member])
        const fp = path.join(uploadDir,d.signature)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        const [rows] = await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[null,id_eva,id_member])
        res.json(rows,{message:'Delect Success!!!!'})
    } catch (error) {
        console.error("Error Delect",error)
        res.status(500).json({message:'Delect Success!!!!'})
    }
})
module.exports = router