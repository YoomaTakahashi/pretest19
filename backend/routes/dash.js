const {verifyToken,requireRole} = require('../middleware/authmiddleware')
const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/eva',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [[evaCount]] = await db.query(`select count(*)as total from tb_member m,tb_eva e where m.id_member=? and e.id_member=m.id_member`,[id_member])
        const [[y]] = await db.query(`select count(*)as total from tb_member m,tb_eva e where m.id_member=? and e.id_member=m.id_member and status_eva!=1 `,[id_member])
        const [[n]] = await db.query(`select count(*)as total from tb_member m,tb_eva e where m.id_member=? and e.id_member=m.id_member and status_eva=1 `,[id_member])
        res.json({
            box:[
                {title:'แบบประเมินทั้งหมด',value: evaCount.total || 0},
                {title:'แบบประเมินทั้งหมดที่ประเมินผลแล้ว',value: evaCount.total > 0 ? `${ (y.total*100/evaCount.total).toFixed(2)}%` : '00.00%'} ,
                {title:'แบบประเมินทั้งหมดที่ยังไม่ได้ประเมิน',value: evaCount.total > 0 ? `${(n.total*100/evaCount.total).toFixed(2)}%` : '00.00%'} ,
            ]
        })
    } catch (error) {
        console.error('error get dash',error)
        res.status(500).json({message:'Error get dash'})
    }
})

router.get('/staff',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const [[staff]] = await db.query(`select count(*)as total from tb_member where role='ฝ่ายบุคลากร'`)
        const [[eva]] = await db.query(`select count(*)as total from tb_member where role='ผู้รับการประเมินผล'`)
        const [[commit]] = await db.query(`select count(*)as total from tb_member where role='กรรมการประเมิน'`)
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva`)
        const [[y]] = await db.query(`select count(*)as total from tb_eva where status_eva = 3`)
        const [[n]] = await db.query(`select count(*)as total from tb_eva where status_eva != 3`)
        res.json({
            box:[
                {title:'จำนวนฝ่ายบุคลากร',value: staff.total || 0},
                {title:'จำนวนผู้รับการประเมิน',value: eva.total || 0},
                {title:'จำนวนกรรมการประเมิน',value: commit.total || 0}
            ],
            box2:[
                {title:'แบบประเมินทั้งหมด',value: evaCount.total || 0},
                {title:'แบบประเมินทั้งหมดที่ประเมินผลแล้ว',value: evaCount.total > 0 ? `${ (y.total*100/evaCount.total).toFixed(2)}%` : '00.00%'} ,
                {title:'แบบประเมินทั้งหมดที่ยังไม่ได้ประเมิน',value: evaCount.total > 0 ? `${(n.total*100/evaCount.total).toFixed(2)}%` : '00.00%'} ,
            ]
        })
    } catch (error) {
        console.error('error get dash',error)
        res.status(500).json({message:'Error get dash'})
    }
})
module.exports = router