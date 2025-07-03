const jwt  = require('jsonwebtoken');


const verifyToken=async(req,res,next)=>{
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader&& authHeader.startsWith('Bearer')){
        token = authHeader.split(' ')[1];

        if(!token){
        return res.status(401).json({message:"You are not authorized, no token provided"})
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decode.id,
            role: decode.role
        };
        console.log(req.user);
        next();

    } catch (error) {
        console.error("Error in token verification:", error);
        return res.status(500).json({message:"invalid token"});
        
    }

    }else{
        return res.status(401).json({message:"You are not authorized, no token provided"})
    }
    
}

module.exports = verifyToken;