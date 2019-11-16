import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json';

export default {
  



  actions: {
    async fetchCategories({dispatch, commit}) {
      const user_id = await dispatch('getUid')
      return await axios
      .get(`http://localhost:8000/categories/${user_id}`)
      .then(function(response) {
        return response.data.categories
      }).catch(function(e) {
        commit('setError', e)
      })
    },  
    async fetchCategoryById({dispatch, commit}, id) {
      return await axios
      .get(`http://localhost:8000/category/${id}`)
      .then(function(response) {
        return response.data.category
      }).catch(function(e) {
        commit('setError', e)
      })
    }, 
    async updateCategory({dispatch, commit}, {name, limit, id}) {
      const user_id = await dispatch('getUid')
      await axios 
      .put(`http://localhost:8000/categories/${id}`, {user_id, name, limit})
    },

    async createCategory({commit, dispatch}, {name, limit}) {
      const user_id = await dispatch('getUid')
      const id = await axios
      .post('http://localhost:8000/categories', {user_id, name, limit})
      .then(function (response) {
        return response.data.category.id
      })
      .catch(
        function(e) {
          commit('setError', e.response.date)
          throw e
        }
      )
      return {name, limit, id}
    },
    
  }
}
