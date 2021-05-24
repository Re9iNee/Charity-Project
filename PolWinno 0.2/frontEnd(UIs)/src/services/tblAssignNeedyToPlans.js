import http from './httpService';
import config from './config.json';


export const getAssignNeedyToPlan = () => {
    return http.get(`${config.localhost}/api/assignNeedyToPlans`);
};


export const newAssignNeedyToPlan= (assignNeedyPlan) => {
    return http.post(`${config.localhost}/api/assignNeedyToPlans` , JSON.stringify(assignNeedyPlan) );
};


export const deleteAssignNeedyToPlan = (assignNeedyPlanId) => {
    return http.delete(`${config.localhost}/api/assignNeedyToPlans/${assignNeedyPlanId}`);
};