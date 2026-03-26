const jwt = require("jsonwebtoken");

const SECRET = "secretkey";

const authenticate = (req, res, next) => {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      message: "Token required"
    });
  }

  const token = header.split(" ")[1];

  try {

    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = authenticate;