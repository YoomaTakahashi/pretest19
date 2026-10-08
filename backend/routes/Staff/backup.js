const bc = require('bcrypt')
const express = require('express')
const router = express.Router()
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const mysql = require('mysql2')
router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const request = req.body?.tables
        if(!Array.isArray(request) || request.length === 0 || request.some(name => typeof name !== 'string')){
            return res.status(400).json({message:'กรุณาเลือกตาราง'})

        }
        const [avaiRows] = await db.query(`select TABLE_NAME as name from information_schema.TABLES where TABLE_SCHEMA = DATABASE() and TABLE_TYPE = 'BASE TABLE'`)
        const [avaiTable] = new Set(avaiRows.map(row => row.name))
        const tables = [...new Set(request)]
        const quote = value => `\`${value.replace(/`/g,'``')}\``
        const dump = [
            `-- NTC EVALUATION SYSTEM database backup`,
            `--Generate at ${new Date().toISOString()}`,
            `SET NAMES utf8mb4;`,
            `SET FOREIGN_KEY_CHECKS=0`,
            ''
        ]

        for(const table of tables){
            const quoteTable = quote(table)
            const [create] = await db.query(`show create table ${quoteTable}`)
            dump.push(`-- Structure for table ${table}`)
            dump.push(`DROP TABLE IF EXIST ${quoteTable}`)
            dump.push(`${create[0]['create Table']};`)

            const [rows] = await db.query(`select * from ${quoteTable}`)
            if(rows.length > 0){
                const col = Object.keys(rows[0])
                const colList = col.map(quote).join(', ')
                const placeholders = col.map(()=> '?').join(', ')
                const insert = `insert into ${quoteTable} (${colList}) values(${placeholders})`
                dump.push(`--Data for table ${table}`)
                for(const row of rows){
                    dump.push(`${mysql.format(insert,col.map(col => row[col]))};`)

                }
            }
            dump.push('')
        }
        dump.push('SET FOREIGN_KEY_CHECKS=1;')
        res.setHeader('Content-Type','application/sql; charset=utf-8')
        res.setHeader('Content-Disposition','attachment;')
        res.send(dump.join('\n'))
    } catch (error) {
        console.error("error save",error);
        res.status(500).json({message:"Error save"})
        
    }
})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const [rows]= await db.query(`SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME`)
        res.json(rows)
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"Error get"})
        
    }
})

// router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
//     try {
//         const [rows]= await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member desc`)
//         res.json(rows)
//     } catch (error) {
//         console.error("error get",error);
//         res.status(500).json({message:"Error get"})
        
//     }
// })

module.exports = router