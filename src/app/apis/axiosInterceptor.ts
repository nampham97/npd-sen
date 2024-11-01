import axios, { AxiosRequestHeaders } from 'axios';
import { GetHeaders } from '@/utils/GetHeaders';

// Tạo một instance Axios tùy chỉnh
const axiosInstance = axios.create();

// // Thêm interceptor cho request
axiosInstance.interceptors.request.use(async function (config) {
    const new_token = await GetHeaders();
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${new_token || JSON.parse(localStorage.getItem("user_NPDSEN")!).accessToken}`,
    } as any as AxiosRequestHeaders;
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    const { response, config } = error;
    const status = response?.status;
    // Kiểm tra mã lỗi có phải là 401 hoặc 403 hay không
    if (status === 401 || status === 403) {
        localStorage.removeItem("user_NPDSEN");
    }
    return error.response
});


export default axiosInstance;