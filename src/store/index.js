import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
import category from './category'
import record from './record'

Vue.use(Vuex)
import axios from 'axios'


export default new Vuex.Store({
  state: {
    error: null,
  },
  mutations: {
    setToken(state, token) {
      localStorage.token = token
    },
    clearToken() {
      localStorage.removeItem('token')
    },
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    async fetchCurrency() {
      const key = process.env.VUE_APP_FIXER
      return await axios.get(`http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,RUB`)
        .then(function (response) {
          return response.data
        }).catch(function (e) {
          commit('setError', e)
          throw e
        })
    }
  },
  getters: {
    error: s => s.error
  },
  modules: {
    auth, info, category, record
  }
})
