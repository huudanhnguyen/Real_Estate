export const getProvinces = async () => {
  const res = await fetch("https://provinces.open-api.vn/api/p/");
  return res.json();
};

export const getDistricts = async (provinceCode) => {
  const res = await fetch(
    `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
  );
  return res.json();
};

export const getWards = async (districtCode) => {
  const res = await fetch(
    `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
  );
  return res.json();
};
