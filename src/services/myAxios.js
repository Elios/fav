import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4000/static'
axios.defaults.headers = {
  'Content-Type': 'application/json;charset=UTF-8'
}

export default axios
