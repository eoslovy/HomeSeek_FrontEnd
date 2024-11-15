export default {
    namespaced: true,
    state: {
      isLoggedIn: false,
      user: null
    },
    mutations: {
      SET_LOGIN(state, user) {
        state.isLoggedIn = true
        state.user = user
      },
      SET_LOGOUT(state) {
        state.isLoggedIn = false
        state.user = null
      }
    },
    actions: {
      login({ commit }, user) {
        commit('SET_LOGIN', user)
      },
      logout({ commit }) {
        commit('SET_LOGOUT')
      }
    }
  }