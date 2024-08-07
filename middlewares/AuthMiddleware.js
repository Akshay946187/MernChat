import jwt from 'jsonwebtoken'

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.jwt
    if(!token){
        return res.status(401).send('you are unauthrised')
    }else{
        jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{
            if(err) return res.status(403).send('invalid token')
            req.userId = payload.userId
        next()
        })
    }
    
    console.log(token)
}