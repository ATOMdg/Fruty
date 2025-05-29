import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
    try {
        const response = await $host.post('user/registration', {email, password});
        if (response && response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            return jwtDecode(response.data.token);
        }
        throw new Error('Неверный ответ от сервера');
    } catch (e) {
        console.error('Ошибка регистрации:', e);
        throw e;
    }
};

export const login = async (email, password) => {
    try {
        const response = await $host.post('user/login', {email, password});
        if (response && response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            return jwtDecode(response.data.token);
        }
        throw new Error('Неверный ответ от сервера');
    } catch (e) {
        console.error('Ошибка входа:', e);
        throw e;
    }
};

export const check = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Токен отсутствует');
        }
        const response = await $authHost.get('user/auth');
        if (response && response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            return jwtDecode(response.data.token);
        }
        throw new Error('Неверный ответ от сервера');
    } catch (e) {
        console.error('Ошибка проверки авторизации:', e);
        localStorage.removeItem('token');
        throw e;
    }
};