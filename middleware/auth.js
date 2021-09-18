require("dotenv").config();
const jwt = require("jsonwebtoken");

function createToken(req, res, next) {
  const token = jwt.sign(
    { email: req.body.email, password: req.body.password },
    process.env.TOKEN_KEY
  );
  console.log(token);
  next();
}

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const authToken = authHeader && authHeader.split(" ")[1];
  if (authToken == null) {
    res.status(401).json({
      status: 401,
      success: false,
      message: "No Token",
    });
  } else {
    jwt.verify(authToken, process.env.TOKEN_KEY, (error, token) => {
      if (error) {
        res.status(403).json({
          status: 403,
          success: false,
          message: "Invalid Token",
        });
      } else {
        res.token = token;
        next();
      }
    });
  }
}

module.exports = { createToken, verifyToken };
