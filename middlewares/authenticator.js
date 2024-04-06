const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
   const token =
     req.headers.authorization && req.headers.authorization.split(" ")[1];
   if (!token) {
     return res.status(401).json({ error: "Unauthorized: No token provided" });
   }

   jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
     if (error) {
       return res.status(403).json({ error: "Invalid token" });
     }
     req.user = decoded.user;
     next();
   });
};

module.exports = verifyToken