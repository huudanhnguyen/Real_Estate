const axios = require("axios");
const { User } = require("@models");
const { generateAccessToken, generateRefreshToken } = require("@utils/jwt");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const GoogleService = {
  async getTokens(code) {
    const url = "https://oauth2.googleapis.com/token";

    const { data } = await axios.post(url, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    return data;
  },

  async getGoogleUserInfo(idToken, accessToken) {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    return res.data;
  },

  async loginWithGoogle(code) {
    const { id_token, access_token } = await this.getTokens(code);

    const googleUser = await this.getGoogleUserInfo(id_token, access_token);

    let user = await User.findOne({ where: { email: googleUser.email } });

    if (!user) {
      // Tạo tài khoản mới
      user = await User.create({
        email: googleUser.email,
        fullName: googleUser.name,
        avatar: googleUser.picture,
        password: "GOOGLE_USER",
      });
    } else {
      // Cập nhật thông tin người dùng
      await user.update({
        fullName: googleUser.name,
        avatar: googleUser.picture,
      });
    }

    const payload = { id: user.id, email: user.email };

    return {
      user,
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  },
};

module.exports = GoogleService;
