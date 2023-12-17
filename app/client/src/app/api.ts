import axios from 'axios';

const baseURL =  window.location.protocol + "//" + window.location.hostname + ":9000";
console.log({ baseURL })

const api = axios.create({ baseURL });
  
export default api;