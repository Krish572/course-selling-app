const jwt = require("jsonwebtoken");

const authMiddleware = (role) => {
    return async function(req, res, next) {
        const authorization = req.headers.authorization;
        if(!authorization){
            return res.status(401).json("Authorization header required");
        }
        const token = authorization.split(" ")[1];
        let accountInfo;
        try{
            if(role === "admin"){
                accountInfo = await jwt.verify(token, process.env.ADMIN_JWT_SECRET);
            }else if(role == "user"){
                accountInfo = await jwt.verify(token, process.env.USER_JWT_SECRET);
            }
        }catch(e){
            return res.status(401).json({
                message: "Invalid or expired token"
            })
        }
        if(!accountInfo){
            return res.status(400).json({
                message: "Invalid token"
            })
        }
        req.id = accountInfo.id;
        next();
    }


}

module.exports = authMiddleware;