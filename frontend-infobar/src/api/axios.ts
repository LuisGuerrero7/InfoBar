import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bug-free-potato-x55jwjrprj69cpp56-5083.app.github.dev/api', //ACTUALIZAR SI SE SALE DE ESTE CODESPACE
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
