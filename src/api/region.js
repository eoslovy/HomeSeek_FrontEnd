import axios from "axios";

export const fetchDongNames = async (si, gu) => {
  return axios.get("http://localhost:8080/map/getDongNames", {
    params: {
      si,
      gu,
    },
  });
};

export const fetchGuNames = async (si) => {
  return axios.get("http://localhost:8080/map/getGuNames", {
    params: {
      si,
    },
  });
};

export const fetchSiNames = () => {
  return axios.get('http://localhost:8080/map/getSiNames');
};
