import http from './httpService';
import config from './config.json';


export const getPersonalInfo = () => {
    return http.get(`${config.localhost}/api/personalInfo`);
};


export const newPersonalInfo= (person) => {
    return http.post(`${config.localhost}/api/personalInfo` , person );
};


export const updatePersonalInfo = (personId, person) => {
    return http.put(`${config.localhost}/api/personalInfo/${personId}`, person);
};


export const deletePersonalInfo = (personId) => {
    return http.delete(`${config.localhost}/api/personalInfo/${personId}`);
};