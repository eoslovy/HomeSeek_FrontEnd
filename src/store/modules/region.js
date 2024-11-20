import { fetchSiNames, fetchGuNames, fetchDongNames } from "@/api/region";
export default {
  namespaced: true,
  state: {
    sidoList: [],
    gugunList: [],
    dongList: [],
  },
  mutations: {
    setGugunList(state, guguns) {
      state.gugunList = guguns;
    },
    setDongList(state, dongList) {
      state.dongList = dongList;
    },
    setSidoList(state, sidoList) {
      state.sidoList = sidoList;
    },
  },
  actions: {
    async fetchSidoList({ commit }) {
      try {
        const response = await fetchSiNames();
        const formattedSidoList = response.data.map((si) => ({
          code: si.siCode,
          name: si.siName,
        }));
        commit("setSidoList", formattedSidoList);
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
