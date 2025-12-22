import axios from "axios";
const api = axios.create({ baseURL: ProcessingInstruction.env.API_URL || "https://api.example.com"});
// request/response interceptors to add auth token
export default api;