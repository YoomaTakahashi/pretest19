const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

exports.verifyToken = (req,res,next)=>{
    const authHeader = req.header("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message:'INVALID NO OR TOKEN'})
    }
    const token = authHeader.split(" ")[1]
    try {
        req.user = jwt.verify(token,JWT_SECRET)
        next()
    } catch (error) {
        console.error('INVALID NO OR TOKEN',error)
        res.status(403).json({message:'INVALID NO OR TOKEN'})
    }
}
exports.requireRole = (role)=>(req,res,next)=>{
    try {
        if(req.user && req.user.role === role){
            return next()
        }
        res.status(403).json({message:'INVALID NO OR ROLE'})
    } catch (error) {
        console.error('INVALID NO OR ROLE',error)
        res.status(403).json({message:'INVALID NO OR ROLE'})
    }
}