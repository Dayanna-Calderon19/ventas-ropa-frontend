import axios from "axios";
import { obtenerToken, limpiarSesion } from "../utils/almacenamiento.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = obtenerToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            limpiarSesion();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default api;
