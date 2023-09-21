
const jwt = require("jsonwebtoken");

const validateAccessToken = (req, res, next) => {

    try {
  
      let token = req.headers?.authorization?.split(" ")[1];
  
      let decoded;
      if (token) {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      }
      if (decoded) {
        req.decoded_token = decoded
        next()
  
      } else {
        return res.status(401).send({
          message: "Invalid Token"
        })
      }
    } catch (err) {
      res.status_code = 401
      next(err)
    }
  }

  module.exports={
    validateAccessToken
  }