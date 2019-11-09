import axios from 'axios';

export default {
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      await axios
        .post('http://localhost:8000/auth/signin',
          { email, password },
          { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          commit('setToken', response.data.token)
        })
        .catch(function (e) {
          commit('setError', e.response.data.error)
          throw e
        })
    },
    async register ({ dispatch, commit }, { email, password, name }) {
      await axios
        .post('http://localhost:8000/auth/signup',
          { email, password, name },
          { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          commit('setToken', response.data.token)
        })
        .catch(function (e) {
          commit('setError', e.response.data.errors[0])
          throw e
        })
    },

    async getUid ({commit}) {
      let token = localStorage.token 
     return await axios
      .post('http://localhost:8000/auth/getid',
        { token },
        { headers: { 'Content-Type': 'application/json' } })
      .then(function (response) {
        return response.data.id
      })
      .catch(function (e) {
        commit('setError', e.response)
        throw e
      }) 
    },
  

    async logout({commit, dispatch}) {
      await commit('clearToken')
      commit('clearInfo')
    }

  }
}
