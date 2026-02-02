import axios from "axios";

export const api = axios.create({
  baseURL: "https://hrms-lite-1-12ym.onrender.com",
});
