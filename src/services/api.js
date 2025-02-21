import axios from "axios";

const api = axios.create({
  baseURL: "https://ton-api.com", // Remplace par l'URL de ton API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
