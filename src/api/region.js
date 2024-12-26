import axios from "axios";

export const fetchDongNames = async (si, gu) => {
  return axios.get("/api/map/getDongNames", {
    params: {
      si,
      gu,
    },
  });
};

export const fetchGuNames = async (si) => {
  return axios.get("/api/map/getGuNames", {
    params: {
      si,
    },
  });
};

export const fetchSiNames = () => {
  return axios.get('/api/map/getSiNames');
};
