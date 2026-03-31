const jwt = require("jsonwebtoken");
const { User } = require("@models");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check Authorization header
  if (!authHeader) {
    return res.status(401).json({
      message: "Missing Authorization header",
    });
  }

  // 2️⃣ Check Bearer token format
  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }

  try {
    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id, email, role, iat, exp }

    // 4️⃣ Load user from DB
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "role", "isLocked"],
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 5️⃣ Check lock status
    if (user.isLocked) {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị khoá",
      });
    }

    // 6️⃣ Attach user info to request
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
