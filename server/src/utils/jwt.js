// utils/jwt.js
const jwt = require("jsonwebtoken");

// Generic function for token generation
const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Generate Access Token
const generateAccessToken = (payload) =>
  signToken(payload, process.env.JWT_SECRET, "7d");

// Generate Refresh Token
const generateRefreshToken = (payload) =>
  signToken(payload, process.env.JWT_REFRESH_SECRET, "30d");

// Verify Refresh Token + handle error
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
