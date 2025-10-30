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

            // Special handling for 401 errors
            if (error?.response?.status === 401) {
                console.log('401 Unauthorized - User will be logged out');
                // The axios interceptor should handle the logout
                // We still need to return/throw the error for proper error handling
                throw error;
            }

            if (error?.response) {
                if (RESPONSE_CODES.failure.includes(error?.response?.status)) {
                    return error?.response?.data;
                }
            }
            return error || ERROR_MESSAGES.default;
        });
};
