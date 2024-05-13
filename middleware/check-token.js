const jwt = require("jsonwebtoken");

exports.checkTokenMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).send({ message: "token is required" });
    }
    const split_token = token.split(" ")[1];
    jwt.verify(split_token, process.env.JWT_ACCESS_TOKEN_KEY, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({ message: "Token Expired" });
        }
        return res.status(401).send({ message: "Invalid Credentials" });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
