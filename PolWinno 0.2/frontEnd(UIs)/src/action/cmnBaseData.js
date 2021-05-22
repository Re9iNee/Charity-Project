import {getCommonBaseData} from '../services/tblCommonBaseData';


export const getBaseData = () => {
    return async dispatch => {
        const {data} = await getCommonBaseData();
    
        await dispatch( {type : "GET_BASEDATA" , payload : data.result.recordsets[0]} );
    }
};

