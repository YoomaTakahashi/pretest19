const bc = require('bcrypt')
const express = require('express')
const router = express.Router()
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const {fname,lname,email,username,password,role} = req.body
        const hash = await bc.hash(password,10)
        const [rows]= await db.query(`insert into tb_member(fname,lname,email,username,password,role) values(?,?,?,?,?,?)`,[fname,lname,email,username,hash,role])
        res.json(rows)
    } catch (error) {
        console.error("error save",error);
        res.status(500).json({message:"Error save"})
        
    }
})

router.put('/update/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const {id_member} = req.params
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

router.delete('/delete/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const {id_member} = req.params
        
        const [rows]= await db.query(`delete from tb_member where id_member = ?`,[id_member])
        res.json(rows)

        
    } catch (error) {
        console.error("error update",error);
        res.status(500).json({message:"Error update"})
        
    }
})

router.get('/showE',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const [rows]= await db.query(`select * from tb_member where role='ผู้รับการประเมินผล' order by id_member desc`)
        res.json(rows)
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"Error get"})
        
    }
})

router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const [rows]= await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member desc`)
        res.json(rows)
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"Error get"})
        
    }
})

module.exports = router