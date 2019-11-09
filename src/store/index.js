import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null,
  },
  mutations: {
    setToken(state, token) {
      localStorage.token = token
    },
    clearToken() {
      localStorage.token = null
    },
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    }
  },
  getters: {
    error: s => s.error
  },
  modules: {
    auth, info
  }
})
      