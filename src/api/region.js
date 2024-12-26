import axios from "axios";

export const fetchDongNames = async (si, gu) => {
  return axios.get("/map/getDongNames", {
    params: {
      si,
      gu,
    },
  });
};

export const fetchGuNames = async (si) => {
  return axios.get("/map/getGuNames", {
    params: {
      si,
    },
  });
};

export const fetchSiNames = () => {
  return axios.get('/map/getSiNames');
};
