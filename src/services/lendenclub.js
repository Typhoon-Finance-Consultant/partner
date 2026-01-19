// src/services/lendenclub.js
import { coreApi } from './axiosConfig';
import { handleResponse } from './common';

const LENDENCLUB_ENTITY_ID =
    import.meta.env.VITE_LENDENCLUB_ENTITY_ID || 'RRSPO';

export const dedupeCheck = (mobileNumber, pan, email) => {
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/dedupe',
        {
            payload: {
                mobile_number: mobileNumber,
                pan: pan,
                email: email,
                regulated_entity_id: LENDENCLUB_ENTITY_ID,
            },
        },
    );
    return handleResponse(response);
};

export const getPreapprovalOffer = payload => {
    const payloadWithEntity = {
        ...payload,
        regulated_entity_id: LENDENCLUB_ENTITY_ID,
    };
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/preapproval-offer',
        { payload: payloadWithEntity },
    );
    return handleResponse(response);
};

export const createLead = payload => {
    const payloadWithEntity = {
        ...payload,
        regulated_entity_id: LENDENCLUB_ENTITY_ID,
    };
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/lead/create',
        { payload: payloadWithEntity },
    );
    return handleResponse(response);
};

export const getLeadDetail = (leadId, redirectionUrl) => {
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/lead/detail',
        {
            payload: {
                lead_id: leadId,
                redirection_url: redirectionUrl,
                regulated_entity_id: LENDENCLUB_ENTITY_ID,
            },
        },
    );
    return handleResponse(response);
};

export const checkLeadStatus = leadId => {
    const response = coreApi.makeAuthenticatedGetCall(
        `lendenclub/prod/lead/status/${leadId}?regulated_entity_id=${LENDENCLUB_ENTITY_ID}`,
    );
    return handleResponse(response);
};
