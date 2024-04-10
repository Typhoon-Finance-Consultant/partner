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

export const me = () => {
    const response = coreApi.makeAuthenticatedGetCall('partner/me');
    return handleResponse(response);
};

export const getDashboardData = () => {
    const response = coreApi.makeAuthenticatedGetCall('partner/dashboard');
    return handleResponse(response);
};

export const registerPartner = data => {
    const response = coreApi.makePostCall('partner/create', data);
    return handleResponse(response);
};

export const forgotPassword = data => {
    const response = coreApi.makePostCall('user/reset-password-init', data);
    return handleResponse(response);
};

export const updatePassword = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'user/update-password',
        data,
    );
    return handleResponse(response);
};

export const resetPassword = data => {
    const response = coreApi.makePostCall('user/reset-password', data);
    return handleResponse(response);
};

export const resendVerificationLink = data => {
    const response = coreApi.makePostCall('user/resend-verifcation-link', data);
    return handleResponse(response);
};

export const logout = () => {
    const response = coreApi.makeAuthenticatedGetCall('auth/logout');
    return handleResponse(response);
};

export const updatePartnerProfile = data => {
    const response = coreApi.makeAuthenticatedPostCall('partner/profile', data);
    return handleResponse(response);
};

export const sendOTP = data => {
    const response = coreApi.makePostCall('auth/send-otp', data);
    return handleResponse(response);
};

export const verifyOTP = data => {
    const response = coreApi.makePostCall('auth/verify-otp', data);
    return handleResponse(response);
};

export default {
    login,
    registerUser,
    reLogin,
    me,
    getDashboardData,
    forgotPassword,
    registerPartner,
    resetPassword,
    updatePassword,
    updatePartnerProfile,
    sendOTP,
    verifyOTP,
};
