import { toast } from 'react-toastify';
import {deleteCommonBaseType, getCommonBaseType, newCommonBaseType, updateCommonBaseType} from '../services/tblCommonBaseType';



export const getBaseType = () => {
    return async dispatch => {
        const {data} = await getCommonBaseType();
     
        await dispatch( {type : "GET_BASETYPE" , payload : data.result.recordsets[0]} );
    }
};


export const createBaseType = (baseTypeTitle) => {
    return async (dispatch , getState) => {

        const { data , status} = await newCommonBaseType(baseTypeTitle);
       
        if (status === 201) {
            toast.success("رکورد جدید با موفقیت ساخته شد", {
                position: "bottom-right",
                closeOnClick: true
            });
        } 

        await dispatch({
            type: "ADD_BASETYPE",
            payload: [...getState().baseType , data.baseType.recordset[0] ]
        });
    }
};



export const updateBaseType = (baseTypeId, baseTypeTitle) => {
    
    return async (dispatch, getState) => {
        const baseTypes = [...getState().baseType];
        const filteredBaseTypes = baseTypes.filter(
            (baseType) => baseType.CommonBaseTypeId !== baseTypeId
        );
     
        try {
            const { data, status } = await updateCommonBaseType( baseTypeId , baseTypeTitle );

            if (status === 200) {
                toast.success("رکورد با موفقیت ویرایش شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            }

            await dispatch({
                type: "UPDATE_BASETYPE",
                payload: [...filteredBaseTypes, data.baseType.recordset[0]],
            });

        } catch (ex) {
            await dispatch({ type: "UPDATE_BASETYPE", payload: [...baseTypes] });
            console.log(ex);
        }
    };
};



export const clearBaseType  = (baseTypeId) => {

    return async (dispatch, getState) => {
        const baseTypes = [...getState().baseType];
        const filteredBaseTypes = baseTypes.filter(
            (baseType) => baseType.CommonBaseTypeId !== baseTypeId
        );

        try {
           
            const { status } = await deleteCommonBaseType(baseTypeId);
            if (status === 200) {
                toast.success("رکورد با موفقیت حذف شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            } 
            await dispatch({
                type: "CLEAR_BASETYPE",
                payload: [...filteredBaseTypes],
            });
        } catch (ex) {
            await dispatch({ type: "CLEAR_BASETYPE", payload: [...baseTypes] });
            console.log(ex);
        }
    };
};
