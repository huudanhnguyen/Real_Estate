const AuthService = require("@services/auth.service");
const GoogleService = require("@services/google.service");

const AuthController = {

  register: async (req, res) => {
    try {
      const newUser = await AuthService.register(req.body);

      res.status(201).json({
        message: "Đăng ký thành công!",
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },


  login: async (req, res) => {
    try {
      const data = await AuthService.login(req.body);

      res.status(200).json({
        message: "Đăng nhập thành công",
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.fullName,
          role: data.user.role, 
        },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  me: async (req, res) => {
    try {
      const userId = req.user?.id; 

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Không tìm thấy user trong token!" });
      }

      const user = await AuthService.getProfile(userId);

      res.status(200).json({
        message: "Lấy thông tin user thành công",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          avatarPath: user.avatarPath,
          balance: user.balance,
          score: user.score,
          role: user.role, 
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  refresh: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const data = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        message: "Refresh token thành công",
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.fullName,
          role: data.user.role,
        },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },

  googleLogin: async (req, res) => {
    try {
      const code = req.query.code;

      const data = await GoogleService.loginWithGoogle(code);

      return res.redirect(
        `http://localhost:5173/login-success?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`
      );
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);

      res.status(200).json({
        message: "Nếu email tồn tại, hệ thống đã gửi link khôi phục mật khẩu!",
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  verifyResetToken: async (req, res) => {
    try {
      const { token } = req.query;

      const data = await AuthService.verifyResetToken(token);

      res.status(200).json({
        message: "Token hợp lệ",
        ...data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },


  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      await AuthService.resetPassword(token, password);

      res.status(200).json({
        message: "Đặt lại mật khẩu thành công!",
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = AuthController;
