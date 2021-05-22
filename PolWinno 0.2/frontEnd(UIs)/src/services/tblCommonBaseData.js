import http from './httpService';
import config from './config.json';


export const getCommonBaseData = () => {
    return http.get(`${config.localhost}/api/commonBaseData`);
};

