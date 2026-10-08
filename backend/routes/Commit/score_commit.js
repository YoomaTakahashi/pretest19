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

router.get('/topic/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[RowCommit]] = await db.query(`select * from tb_commit where id_member=? and id_eva=?`,[id_member,id_eva])
        var statusCommit = 0
        if(RowCommit.level_commit === 'ประธาน'){
            statusCommit = 2
        }else if(RowCommit.level_commit === 'ประธาน'){
            statusCommit = 3
        }else if(RowCommit.level_commit === 'ประธาน'){
            statusCommit = 4
        }
        const [topics] = await db.query(`select * from tb_topic `)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and status_eva=? and id_eva=?`,[statusCommit,id_eva])
        const result = topics.map(t=>({
            ...t, indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error('error get topic',error)
        res.status(500).json({message:'Error get topic'})
    }
})
module.exports = router