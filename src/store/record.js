import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json';

export default {
  actions: {
    async createRecord({ dispatch, commit }, record) {
      await axios.post('http://localhost:8000/records', record )
        .then(function (response) {
          return response.data
        }).catch(function (e) {
          commit('setError', e)
          throw e
        })
    },
    async fetchRecords({dispatch, commit}) {
      const user_id = await dispatch('getUid')
      return await axios
      .get(`http://localhost:8000/records/${user_id}`)
      .then(function(response) {
        return response.data.records
      }).catch(function (e) {
        commit('setError', e)
        throw e
      })
    },
    async fetchRecordById({dispatch, commit}, id) {
      return await axios
      .get(`http://localhost:8000/record/${id}`)
      .then(function(response) {
        return response.data.record
      }).catch(function (e) {
        commit('setError', e)
        throw e
      })
    }
  },
}
