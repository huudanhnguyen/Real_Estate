const jwt = require("jsonwebtoken");

const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const generateAccessToken = (payload) =>
  signToken(payload, process.env.JWT_SECRET, "7d");

const generateRefreshToken = (payload) =>
  signToken(payload, process.env.JWT_REFRESH_SECRET, "30d");

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error("Refresh token không hợp lệ hoặc đã hết hạn!");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
