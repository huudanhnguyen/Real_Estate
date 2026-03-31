import axios from "@/config/axios";

export const getPricingAPI = () => {
  return axios.get("/pricings");
};