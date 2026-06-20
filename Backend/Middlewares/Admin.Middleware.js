const jwt = require("jsonwebtoken");

const Admin = require("../Models/Admin");

const adminMiddleware = async(req , res, next)=>{
    try{
const authHeader = req.headers.authorization;
if(!authHeader) {
    return res.status(400).json({ message: "error" });
}
const token = authHeader.split(" ")[1];
const decodedToken = jwt.verify(token , process.env.SECRET_KEY);

const admin = await Admin.findById(decodedToken.id);
if(!admin){
    return res.status(400).json({ message: "error" });
}
req.admin=decodedToken;
next();

    }
catch(error){
    res.status(401).json({message: "Invalid Token"});


}};

module.exports = adminMiddleware ;

