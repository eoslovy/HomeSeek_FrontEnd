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

  searchByToggleWithSi: (code) => {
    return api.get("/map/getEstatesByToggleWithSi", {
      params: { code }
    });
  },

  searchByToggleWithGu: (code) => {
    return api.get("/map/getEstatesByToggleWithGu", {
      params: { code }
    });
  },

  searchByToggleWithDong: (code) => {
    return api.get("/map/getEstatesByToggleWithDong", {
      params: { code }
    });
  }
};
