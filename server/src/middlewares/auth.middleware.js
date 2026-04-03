const jwt = require("jsonwebtoken");
const { User } = require("@models");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 Tìm user
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "role", "isLocked"],
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.isLocked) {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị khoá",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = auth;
