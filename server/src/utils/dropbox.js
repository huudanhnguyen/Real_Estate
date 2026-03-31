const fetch = require("node-fetch");
require("dotenv").config();

async function getDropboxAccessToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", process.env.DROPBOX_REFRESH_TOKEN);

  const auth = Buffer.from(
    `${process.env.DROPBOX_APP_KEY}:${process.env.DROPBOX_APP_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await res.json();

  if (!data.access_token) {
    console.log("LỖI TẠO ACCESS TOKEN:", data);
    throw new Error("Không lấy được access_token Dropbox");
  }

  return data.access_token;
}

module.exports = { getDropboxAccessToken };
