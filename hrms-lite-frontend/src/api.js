import axios from "axios";

export const api = axios.create({
  baseURL: "https://hrms-lite-1-12ym.onrender.com"
});

const BASE_URL = import.meta.env.VITE_API_URL;
console.log("API:", BASE_URL);