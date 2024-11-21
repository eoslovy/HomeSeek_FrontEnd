import api from "./index";

export const houseApi = {
  // 이름으로 부동산 검색
  searchByName: (keyword) => {
    return api.get("/map/getEstateByName", {
      params: {
        keyword,
      },
    });
  },

  // 지역 코드로 부동산 검색
  searchByRegion: (regionCode) => {
    return api.get("/map/getEstateByRegion", {
      params: {
        regionCode,
      },
    });
  },

  // 시/도 코드로 아파트 검색
  searchByToggleWithSi: (code) => {
    return api.get("/map/getEstatesByToggleWithSi", {
      params: { code }
    });
  }
};
