import http from './httpService';
import config from './config.json';


export const getPlan = () => {
    return http.get(`${config.localhost}/api/plans`);
};


export const newPlan= (plan) => {
    return http.post(`${config.localhost}/api/plans` , plan );
};


export const updatePlan = (planId, plan) => {
    return http.put(`${config.localhost}/api/plans/${planId}`, plan);
};


export const deletePlan = (planId) => {
    return http.delete(`${config.localhost}/api/plans/${planId}`);
};