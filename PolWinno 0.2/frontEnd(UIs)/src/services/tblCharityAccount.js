import http from './httpService';
import config from './config.json';


export const getCharityAccount = () => {
    return http.get(`${config.localhost}/api/charityAccounts`);
};


export const newCharityAccount= (charityAcc) => {
    return http.post(`${config.localhost}/api/charityAccounts` , JSON.stringify(charityAcc) );
};


export const updateCharityAccount  = (charityAccountId, charityAcc) => {
    return http.put(`${config.localhost}/api/charityAccounts/${charityAccountId}`, {charityAcc});
};


export const deleteCharityAccount = (charityAccountId) => {
    return http.delete(`${config.localhost}/api/charityAccounts/${charityAccountId}`);
};