import { fetchSiNames, fetchGuNames, fetchDongNames } from "@/api/region";
export default {
  namespaced: true,
  state: {
    sidoList: [],
    gugunList: [],
    dongList: [],
  },
  mutations: {
    setSidoList(state, sidoList) {
      state.sidoList = sidoList;
    },
    setGugunList(state, gugunList) {
      console.log('스토어에 저장되는 구 목록:', gugunList);
      state.gugunList = gugunList;
    },
    setDongList(state, dongList) {
      state.dongList = dongList;
    },
  },
  actions: {
    async fetchSidoList({ commit }) {
      try {
        const response = await fetchSiNames();
        commit("setSidoList", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching sido list:", error);
        throw error;
      }
    },
    async fetchGugunList({ commit }, sido) {
      try {
        const response = await fetchGuNames(sido);
        commit("setGugunList", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching gugun list:", error);
        throw error;
      }
    },
    async fetchDongList({ commit }, { si, gu }) {
      try {
        const response = await fetchDongNames(si, gu);
        commit("setDongList", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching dong list:", error);
        throw error;
      }
    },
  },
};
