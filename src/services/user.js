import { coreApi } from './axiosConfig';
import { handleResponse } from './common';

export const login = data => {
    const response = coreApi.makePostCall('login', data);
    return handleResponse(response);
};

export const registerUser = data => {
    const response = coreApi.makePostCall('register', data);
    return handleResponse(response);
};

export const reLogin = data => {
    const response = coreApi.makePostCall('token/refresh', data);
    return handleResponse(response);
};

export const me = ()  =>{
    const response = coreApi.makeAuthenticatedGetCall('partner/me');
    return handleResponse(response);
}

export const getDashboardData = ()=> {
    const response = coreApi.makeAuthenticatedGetCall('partner/dashboard');
    return handleResponse(response);
}

export default {
    login,
    registerUser,
    reLogin,
    me,
    getDashboardData
}