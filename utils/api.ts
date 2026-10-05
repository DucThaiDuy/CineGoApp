import axios from "axios";

// Sử dụng IP máy tính của bạn (192.168.0.4) để Expo Go trên điện thoại có thể kết nối được.
// Phải đảm bảo điện thoại và máy tính dùng chung một mạng Wifi.
const BASE_URL = "http://192.168.0.3:8080/api"; 

import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Tăng lên 30 giây để tránh timeout quá sớm
  headers: {
    "Accept": "application/json",
  },
});

// Interceptor để tự động gắn token vào header
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
