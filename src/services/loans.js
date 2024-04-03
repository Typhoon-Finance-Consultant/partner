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

export const getDocumentList = data => {
    const response = coreApi.makeAuthenticatedPostCall('document/list', data);
    return handleResponse(response);
};

export const uploadDocument = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'document/upload',
        data,
        {
            'Content-Type': 'multipart/form-data',
        }
    );
    return handleResponse(response);
};

export const updateAddress = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/address/update',
        data,
    );
    return handleResponse(response);
};

export const updateIncomeProfile = data => {
    const response = coreApi.makeAuthenticatedPostCall('income/update', data);
    return handleResponse(response);
};

export const getEmployerList = () => {
    const response = coreApi.makeAuthenticatedGetCall('income/employer/list');
    return handleResponse(response);
};

export const handleLeadCreation = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'partner/leads/create',
        data,
    );
    return handleResponse(response);
};

export const checkLeadStatus = leadID => {
    const response = coreApi.makeAuthenticatedGetCall(
        `partner/lead-status/${leadID}`,
    );
    return handleResponse(response);
};

export const submitLoanApplication = data => {
    const response = coreApi.makeAuthenticatedPostCall('loans/create', data);
    return handleResponse(response);
};

export const updateBasicDetails = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/basic/update',
        data,
    );
    return handleResponse(response);
};

export const handleLeadVerification = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/verification',
        data,
    );
    return handleResponse(response);
};

export const updateLoanReference = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/reference/update',
        data,
    );
    return handleResponse(response);
};
