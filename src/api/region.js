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

export const fetchGugun = async (sidoCode) => {
  // 임시 데이터
  const gugunData = {
    11: [
      { code: "11110", name: "종로구" },
      { code: "11120", name: "중구" },
      { code: "11130", name: "용산구" },
    ],
    41: [
      { code: "41110", name: "수원시" },
      { code: "41120", name: "성남시" },
      { code: "41130", name: "의정부시" },
    ],
  };
  return {
    data: gugunData[sidoCode] || [],
  };
};

export const fetchDong = async (gugunCode) => {
  // 임시 데이터
  const dongData = {
    11110: [
      { code: "1111010100", name: "청운동" },
      { code: "1111010200", name: "신교동" },
    ],
    41110: [
      { code: "4111010100", name: "장안동" },
      { code: "4111010200", name: "정자동" },
    ],
  };
  return {
    data: dongData[gugunCode] || [],
  };
};
