const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  const token = req.headers.authorization

    if(token){
      const secret = "super secret";
      jwt.verify(token,secret, (err, decodedToken)=>{
        if(err){
res.status(401).json({message:"token not valid"})
        }else{
          req.user={
            username:decodedToken.username
          }
          next()
        }
      })
    } else{
      res.status(400).json({message: "you need a token to play this game"})
    }
};
