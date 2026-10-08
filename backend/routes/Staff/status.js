
const express = require('express')
const router = express.Router()
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.get('/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const {id_eva} =req.params
        const [rows] = await db.query(`select  * from tb_member m,tb_eva e,tb_commit c where c.id_eva=? and c.id_member=m.id_member and c.id_eva=e.id_eva order by e.id_eva desc`,[id_eva])
        res.json(rows)
    } catch (error) {
        console.error('error get profile',error)
        res.status(500).json({message:'Error get Profile'})
    }
})

module.exports = router