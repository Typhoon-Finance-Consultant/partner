import { RESPONSE_CODES, ERROR_MESSAGES } from '&/helpers/constants';

export const handleResponse = result => {
    return result
        .then(data => {
            console.log(
                'API Response Data_____',
                data?.config?.url,
                data?.data?.code,
            );
            return data?.data;
        })
        .catch(function (error) {
            console.error(
                error,
                error?.code,
                error?.response?.status,
                '---- API Response Error',
            );
            if (error?.response) {
                if (RESPONSE_CODES.failure.includes(error?.response?.status)) {
                    return error?.response?.data;
                }
            }
            return error || ERROR_MESSAGES.default;
        });
};
