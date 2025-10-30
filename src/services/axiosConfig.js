import Axios from 'axios';
import { setCredentials, logOut } from '../features/auth/authSlice';
import { persistor, store } from '../features/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Global variable to store navigation function
let navigate = null;

// Function to set the navigate function from router
export const setNavigateFunction = navigationFunction => {
    navigate = navigationFunction;
};

// Global logout function that handles both Redux and navigation
const logOutUser = () => {
    console.log('Logging out user due to 401 response');

    // Clear Redux state
    store.dispatch(logOut());

    // Clear persisted data
    if (persistor) {
        persistor.purge();
    }

    // Clear localStorage (if any auth data is stored there)
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Navigate to login if navigation function is available
    if (navigate) {
        navigate('/login', { replace: true });
    } else {
        // Fallback to window location if navigate is not available
        window.location.href = '/login';
    }
};

class AxiosInstance {
    constructor(baseURL) {
        AxiosInstance.baseURL = baseURL;
        // const isKey = baseURL === API_CONFIG.API_URL;
        this.axios = Axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.headers = new Headers({});
        this.axios.interceptors.request.use(async function (config) {
            try {
                console.log(
                    'config?.headers?.Authorization',
                    config?.headers?.Authorization,
                );
                // if (config?.headers?.Authorization) {
                //     let checkToken = store.dispatch;

                //     const user = jwtDecode(accessToken);
                //     const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
                //     console.log('===isExpired', user);
                //     if (isExpired) {
                //         const payload = { refresh: refreshToken };
                //         let json = await userService.reLogin(payload);
                //         if (json.success) {
                //             config.headers.Authorization = `Bearer ${json?.data?.accessToken}`;

                //         } else {
                //             logOutUser();
                //         }
                //     }
                // }
                // Start the HTTP metric
            } catch (error) {
                // Handle any errors that occur while creating or starting the metric
                console.log('Error creating HTTP metric:', error);
            } finally {
                return config;
            }
        });
        this.axios.interceptors.response.use(
            async response => {
                // console.log('response received axios interceptor',response?.config?.url);
                try {
                    const { httpMetric } = response.config.metadata;
                    httpMetric.setHttpResponseCode(response?.status);
                    // httpMetric.setResponseContentType(response.headers['content-type']);
                    await httpMetric.stop();
                } finally {
                    return response;
                }
            },
            async function (error) {
                console.log(
                    'get config-------',
                    error.response,
                    '*****',
                    error.config,
                );
                const originalRequest = error.config;
                if (error?.response?.status === 401) {
                    logOutUser();
                }
                // else if(error?.response?.status !== 401){
                //     originalRequest._retry = true;
                //     return axiosInstance(originalRequest);
                // }

                return Promise.reject(error);
            },
        );
    }

    makeGetCall = (endpoint, headers) => this.axios.get(endpoint, { headers });

    makePostCall = (endpoint, data) => this.axios.post(endpoint, data);

    getToken = async () => {
        const token = store.getState().auth.token;
        if (!token) {
            store.dispatch(logOut());
            this.token = null;
        }
        this.token = token;
        return token;
    };

    logOutUser = () => {
        logOutUser(); // Use the global logout function
    };
    makeAuthenticatedGetCall = async url => {
        try {
            const accessToken = await this.getToken();

            if (!accessToken) {
                this.logOutUser();
                return new Promise((resolve, reject) => {
                    reject('UnauthenticatedUser');
                });
            }
            const headers = {
                // 'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            };

            return this.axios.get(url, {
                headers,
            });
        } catch (error) {
            //  console.error('Network Error', error);
        }
    };

    makeAuthenticatedPostCall = async (url, data, customHeader = {}) => {
        try {
            const accessToken = await this.getToken();

            if (!accessToken) {
                this.logOutUser();
                return new Promise((resolve, reject) => {
                    reject('UnauthenticatedUser');
                });
            }
            const headers = {
                // 'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                ...customHeader,
            };

            return this.axios.post(url, data, {
                headers,
            });
        } catch (error) {
            //  console.error('Network Error', error);
        }
    };

    makeAuthenticatedPutCall = async (url, data) => {
        try {
            const accessToken = await this.getToken();
            if (!accessToken) {
                this.logOutUser();
                return new Promise((resolve, reject) => {
                    reject('UnauthenticatedUser');
                });
            }
            const headers = {
                // 'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            };
            return this.axios.put(url, data, {
                headers,
            });
        } catch (error) {
            //  console.error('Network Error', error);
        }
    };

    makeAuthenticatedDeleteCall = async (endPoint, keepToken = true) => {
        try {
            const accessToken = await this.getToken();
            if (!accessToken) {
                this.logOutUser();
                return new Promise((resolve, reject) => {
                    reject('UnauthenticatedUser');
                });
            }
            const headers = {
                // 'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            };
            return this.axios.delete(url, data, {
                headers,
            });
        } catch (error) {
            //  console.error('Network Error', error);
        }
    };
}

class CoreAPI extends AxiosInstance {
    constructor() {
        if (CoreAPI.instance) {
            return CoreAPI.instance;
        }
        //  console.log('Core api new instance');
        super(API_BASE_URL);
        CoreAPI.instance = this;
    }
}

export const coreApi = new CoreAPI();
console.log('ENV Variable for API Endpoint', API_BASE_URL);
