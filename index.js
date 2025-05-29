import axios from "axios"

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/',
    withCredentials: true
});
  
const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/',
    withCredentials: true
});

const authInterceptor = config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
};