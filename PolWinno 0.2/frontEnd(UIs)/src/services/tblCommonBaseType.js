import http from './httpService';
import config from './config.json';


export const getCommonBaseType = () => {
    return http.get(`${config.localhost}/api/commonBaseType`);
};


export const newCommonBaseType = (BaseTypeTitle) => {
    return http.post(`${config.localhost}/api/commonBaseType` ,  JSON.stringify(BaseTypeTitle) );
};


export const updateCommonBaseType  = (commonBaseTypeId, BaseTypeTitle) => {
    return http.put(`${config.localhost}/api/commonBaseType/${commonBaseTypeId}`, {BaseTypeTitle});
};


export const deleteCommonBaseType = (commonBaseTypeId) => {
    return http.delete(`${config.localhost}/api/commonBaseType/${commonBaseTypeId}`);
};