const axios = require("axios");

const API = axios.create({
  baseURL: "https://provinces.open-api.vn/api",
  timeout: 5000,
});

const isNumericCode = (v) => typeof v === "string" && /^[0-9]+$/.test(v);

/* ================= PROVINCE ================= */
const getProvinceName = async (province) => {
  if (!province) return null;
  if (!isNumericCode(province)) return province;

  const res = await API.get(`/p/${province}`);
  return res.data?.name || null;
};

/* ================= DISTRICT ================= */
const getDistrictName = async (district) => {
  if (!district) return null;
  if (!isNumericCode(district)) return district;

  const res = await API.get(`/d/${district}`);
  return res.data?.name || null;
};

const getWardName = async (wardCode, districtCode) => {
  if (!wardCode || !districtCode) return wardCode;
  if (!/^[0-9]+$/.test(wardCode)) return wardCode;

  try {
    const res = await API.get(`/d/${districtCode}?depth=2`);

    const ward = res.data?.wards?.find(
      (w) => w.code.toString() === wardCode.toString(),
    );

    return ward?.name || wardCode;
  } catch (err) {
    console.warn("Location API failed (ward), fallback:", wardCode);
    return wardCode;
  }
};





module.exports = {
  getProvinceName,
  getDistrictName,
  getWardName,
};
