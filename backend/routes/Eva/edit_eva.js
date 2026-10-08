const bc = require('bcrypt')
const express = require('express')
const router = express.Router()
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.get('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [rows]= await db.query(`select fname,lname,username,email,role from tb_member where id_member=?`,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("error get user",error);
        res.status(500).json({message:"Error get user"})
        
    }
})

router.put('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const {fname,lname,email,username,password,role} = req.body
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            const [rows]= await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,password=?,role=? where id_member = ?`,[fname,lname,email,username,hash,role,id_member])
            res.json(rows)
        }else{
            const [rows]= await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,role=? where id_member = ? `,[fname,lname,email,username,role,id_member])
            res.json(rows)
        }
        
    } catch (error) {
        console.error("error update",error);
        res.status(500).json({message:"Error update"})
        
    }
})



module.exports = router