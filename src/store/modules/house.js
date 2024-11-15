export default {
  namespaced: true,

  state: {
    houses: [],
  },

  mutations: {
    setHouses(state, houses) {
      state.houses = houses;
    },
  },
};
