const jwt = require("jsonwebtoken");

exports.generateAccessTokenWithExpire = (email) => {
  return jwt.sign({ email }, process.env.JWT_ACCESS_TOKEN_KEY, {
    expiresIn: "10m",
  });
};

exports.generateAccessToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.JWT_ACCESS_TOKEN_KEY);
};
