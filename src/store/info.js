import axios from 'axios';

export default {
  state: {
    info: {}
  },
  mutations: {
    setInfo(state, info) {
      state.info = info
    },
    clearInfo(state) {
      state.info = {}
    }
  },
  actions: {
    async fetchInfo({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const info = await axios.get(
          `http://localhost:8000/auth/getinfo/${uid}`,
          { headers: { 'Content-Type': 'application/json' } })
          .then(
            function(response) {
              return response.data
            }
          )
          commit('setInfo', info)
        } catch (e) {

      }


    }
  },
  getters: {
    info: s => s.info
  }
}
