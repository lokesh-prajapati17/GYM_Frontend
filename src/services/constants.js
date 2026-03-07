const ENV = import.meta.env.MODE || 'development';

const API_URLS = {
    // In development, we use Vite's proxy (/api/app) which forwards to localhost:5000
    development: import.meta.env.VITE_API_URL || '/api/app',
    // production: 'https://api.yourgymcrm.com/api/app',
    // live: 'https://api.yourgymcrm.com/api/app',
};

console.log(API_URLS);

export const BASE_URL = API_URLS[ENV] || API_URLS.development;
