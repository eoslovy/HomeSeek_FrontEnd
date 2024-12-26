import axios from "axios";

export const fetchDongNames = async (si, gu) => {
  return axios.get("http://ec2-3-39-240-71.ap-northeast-2.compute.amazonaws.com:8080/map/getDongNames", {
    params: {
      si,
      gu,
    },
  });
};

export const fetchGuNames = async (si) => {
  return axios.get("http://ec2-3-39-240-71.ap-northeast-2.compute.amazonaws.com:8080/map/getGuNames", {
    params: {
      si,
    },
  });
};

export const fetchSiNames = () => {
  return axios.get('http://ec2-3-39-240-71.ap-northeast-2.compute.amazonaws.com:8080/map/getSiNames');
};
