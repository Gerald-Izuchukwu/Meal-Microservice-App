const jwt = require('jsonwebtoken')
const secret = process.env.JWT_ACCESS_TOKEN_SECRET
async function isAuthenticated(req, res, next){
    try {
        const token = req.headers["authorization"].split(" ")[1]
        if(!token){
            console.log('User not authorized');
        }
    
        // verify the token to know if its legit
        jwt.verify(token, secret, (err, user)=>{
            if (err){
                console.log(err);
                return res.status(400).send("You are not authenticated to access this route, please log in")
            }else{
                req.user = user
                next()
            }
        } )
    
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error' + error)
    }


}

module.exports = isAuthenticated