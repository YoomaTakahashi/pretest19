const express =require('express')
const db =require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.get('/user/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select  * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_member=m.id_member and c.id_eva=? and c.id_eva=e.id_eva and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member,id_eva])
        res.json(rows[0])
    } catch (error) {
        console.error('error get user',error)
        res.status(500).json({message:'Error get user'})
    }
})
module.exports = router