const jwt= require('jsonwebtoken');
const jwtMiddleware=(req,res,next)=>{
    const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "Auth", function (err, payload) {
      if (err) {
        console.log(err)
        return res.send({ message: "token expired", status: 0 });
      } else {
        next();
      }
    });
  } else {
    return res.send({
      message: "token expired",
      status: 1,
    });
  }
}
module.exports=jwtMiddleware