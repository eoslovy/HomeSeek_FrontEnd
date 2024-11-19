import { fetchSido, fetchGuNames, fetchDongNames } from "@/api/region";

export default {
  namespaced: true,
  state: {
    sidoList: [],
    gugunList: [],
    dongList: [],
  },
  mutations: {
    SET_SIDO_LIST(state, sidos) {
      state.sidoList = sidos;
    },
    setGugunList(state, guguns) {
      state.gugunList = guguns;
    },
    setDongList(state, dongList) {
      state.dongList = dongList;
    },
  },
  actions: {
    async fetchSidoList({ commit }) {
      try {
        const response = await fetchSido();
        commit("SET_SIDO_LIST", response.data);
      } catch (error) {
        console.error("Error fetching sido list:", error);
      }
    },
    async fetchGugunList({ commit }, sido) {
      try {
        const response = await fetchGuNames(sido);
        const formattedGuList = response.data.map((gu) => ({
          code: gu.guCode,
          name: gu.guName,
        }));
        commit("setGugunList", formattedGuList);
      } catch (error) {
        console.error("Error fetching gugun list:", error);
      }
    },
    async fetchDongList({ commit }, { si, gu }) {
      try {
        const response = await fetchDongNames(si, gu);
        const formattedDongList = response.data.map((dong) => ({
          code: dong.dongCode,
          name: dong.dongName,
        }));
        commit("setDongList", formattedDongList);
      } catch (error) {
        console.error("Error fetching dong list:", error);
      }
    },
  },
};
