import axios from 'axios';

export default {
  actions: {

    async login({ dispatch, commit }, { email, password }) {
      try {
        await axios
          .post('http://localhost:8000/auth/signin', 
          {"email": email,password}, 
          {headers: {'Content-Type':'application/json'}})
          .then(function (response) {
            console.log(response)
          })
          .catch((error) => 
          console.log(error))
      } catch (e) {
        console.log(e)
      }
    }
  }
}
