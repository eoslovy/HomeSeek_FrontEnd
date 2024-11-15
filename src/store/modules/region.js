import { fetchSido, fetchGugun, fetchDong } from '@/api/region'

export default {
  namespaced: true,
  state: {
    sidoList: [],
    gugunList: [],
    dongList: []
  },
  mutations: {
    SET_SIDO_LIST(state, sidos) {
      state.sidoList = sidos
    },
    SET_GUGUN_LIST(state, guguns) {
      state.gugunList = guguns
    },
    SET_DONG_LIST(state, dongs) {
      state.dongList = dongs
    }
  },
  actions: {
    async fetchSidoList({ commit }) {
      try {
        const response = await fetchSido()
        commit('SET_SIDO_LIST', response.data)
      } catch (error) {
        console.error('Error fetching sido list:', error)
      }
    },
    async fetchGugunList({ commit }, sidoCode) {
      try {
        const response = await fetchGugun(sidoCode)
        commit('SET_GUGUN_LIST', response.data)
      } catch (error) {
        console.error('Error fetching gugun list:', error)
      }
    },
    async fetchDongList({ commit }, gugunCode) {
      try {
        const response = await fetchDong(gugunCode)
        commit('SET_DONG_LIST', response.data)
      } catch (error) {
        console.error('Error fetching dong list:', error)
      }
    }
  }
}