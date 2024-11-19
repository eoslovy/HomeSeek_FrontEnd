import axios from "axios";

export const fetchSido = async () => {
  // 임시 데이터
  return {
    data: [
      { code: "11", name: "서울특별시" },
      { code: "41", name: "경기도" },
      { code: "26", name: "부산광역시" },
      { code: "27", name: "대구광역시" },
      { code: "28", name: "인천광역시" },
      { code: "29", name: "광주광역시" },
      { code: "30", name: "대전광역시" },
      { code: "31", name: "울산광역시" },
    ],
  };
};

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
