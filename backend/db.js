const mysql2 = require('mysql2')
const pool = mysql2.createPool({
    host:'mysql',
    user:'root',
    password:'1234',
    database:'pretest19'

})

module.exports = pool.promise()