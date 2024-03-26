import { coreApi } from './axiosConfig';
import { handleResponse } from './common';

export const loansList = data => {
    const response = coreApi.makeAuthenticatedPostCall('loans/list', data);
    return handleResponse(response);
};

export const loanDetails = id => {
    const response = coreApi.makeAuthenticatedGetCall(`loans/details/${id}`);
    return handleResponse(response);
};

export const payoutList = data => {
    const response = coreApi.makeAuthenticatedPostCall('payouts/list', data);
    return handleResponse(response);
};

export const payoutDetails = id => {
    const response = coreApi.makeAuthenticatedGetCall(`payouts/details/${id}`);
    return handleResponse(response);
};

export const updateBankAccount = data => {
    const response = coreApi.makeAuthenticatedPostCall('bank/update', data);
    return handleResponse(response);
};

export const getBankList = () => {
    const response = coreApi.makeAuthenticatedGetCall('bank/list');
    return handleResponse(response);
};

export const getDocumentList = () => {
    const response = coreApi.makeAuthenticatedPostCall("document/list")
    return handleResponse(response);

}

export const uploadDocument = () => {
    const response = coreApi.makeAuthenticatedPostCall("document/upload")
    return handleResponse(response);

}

export const updateAddress = (data) => {
    const response = coreApi.makeAuthenticatedPostCall("loan/address/update", data)
    return handleResponse(response);

}