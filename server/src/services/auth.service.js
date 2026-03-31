const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");

const { User } = require("@models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("@utils/jwt");
const sendEmail = require("@utils/sendEmail");

const AuthService = {

  register: async ({ fullName, email, password, phone }) => {
    const existUser = await User.findOne({
      where: { email },
      attributes: ["id"],
    });

    if (existUser) {
      throw new Error("Email đã tồn tại!");
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPwd,
      role: "user",
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "fullName", "role", "password"],
    });

    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }
    if (user.isLocked) {
      throw new Error("Tài khoản của bạn đã bị khoá");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  },

  getProfile: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "resetPwdToken", "resetPwdExpiry"],
      },
    });

    if (!user) {
      throw new Error("User không tồn tại!");
    }

    return user;
  },

  refreshToken: async (token) => {
    if (!token) {
      throw new Error("Thiếu refresh token!");
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "fullName", "role"],
    });

    if (!user) {
      throw new Error("User không tồn tại!");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  },

  forgotPassword: async (email) => {
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "fullName"],
    });

    if (!user) {
      throw new Error("Email không tồn tại!");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await user.update({
      resetPwdToken: resetToken,
      resetPwdExpiry: Date.now() + 15 * 60 * 1000,
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      "Khôi phục mật khẩu - RealEstate",
      `
        <p>Xin chào ${user.fullName || ""},</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
        <p>Nhấn vào link sau để đặt lại mật khẩu:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link có hiệu lực trong 15 phút.</p>
      `
    );

    return true;
  },

  verifyResetToken: async (token) => {
    const user = await User.findOne({
      where: {
        resetPwdToken: token,
        resetPwdExpiry: { [Op.gt]: Date.now() },
      },
      attributes: ["email"],
    });

    if (!user) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn!");
    }

    return { email: user.email };
  },

  resetPassword: async (token, newPassword) => {
    const user = await User.findOne({
      where: {
        resetPwdToken: token,
        resetPwdExpiry: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn!");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashed,
      resetPwdToken: null,
      resetPwdExpiry: null,
    });

    return true;
  },
};

module.exports = AuthService;
