const jwt = require('jsonwebtoken');
const JWT_secret = "ThisIsSecretMessage";

const fetchuser = (req, res, next)=>{
    // Get the user from the jwt token and add id to request object.
    const token = req.header('auth-token');   // will take the value(authtoken) from the 'auth-token' header.
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
    try{
        const data = jwt.verify(token,JWT_secret);   // Verifying if the authtoken matching with JWT_secret
        req.user = data.user;   // adding user data value to the request
        next();  // next will move to the next function which is /getuser in auth.js file.
    }
    catch{
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
}

module.exports = fetchuser;