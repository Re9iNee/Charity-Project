import { toast } from "react-toastify";
import { deleteCharityAccount, getCharityAccount, newCharityAccount, updateCharityAccount } from "../services/tblCharityAccount";



export const getCharityAcc = () => {
    return async dispatch => {
        const {data} = await getCharityAccount();
     
        await dispatch( {type : "GET_CHARITYACC" , payload : data.result.recordsets[0]} );
    }
};


export const createCharityAcc = (charityAcc) => {
    return async (dispatch , getState) => {
        const { data , status} = await newCharityAccount(charityAcc);
      
        if (status === 201) {
            toast.success("رکورد جدید با موفقیت ساخته شد", {
                position: "bottom-right",
                closeOnClick: true
            });
        } 

        await dispatch({
            type: "ADD_CHARITYACC",
            payload: [...getState().charityAccount , data.charityAccount.recordset[0] ]
        });
    }
};


export const updateCharityAcc = (charityAccId , charityAcc) => {
    
    return async (dispatch, getState) => {
        const charityAccounts = [...getState().charityAccount];
        const filteredCharityAccounts = charityAccounts.filter(
            (charityAccount) => charityAccount.CharityAccountId !== charityAccId
        );
     
        try {
            const { data, status } = await updateCharityAccount( charityAccId , charityAcc );

            if (status === 200) {
                toast.success("رکورد با موفقیت ویرایش شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            }

            await dispatch({
                type: "UPDATE_CHARITYACC",
                payload: [...filteredCharityAccounts, data.charityAccount.recordset[0]],
            });

        } catch (ex) {
            await dispatch({ type: "UPDATE_CHARITYACC", payload: [...charityAccounts] });
            console.log(ex);
        }
    };
};


export const clearCharityAccount  = (charityAccId) => {

    return async (dispatch, getState) => {
        const charityAccounts = [...getState().charityAccount];
        const filteredCharityAccounts = charityAccounts.filter(
            (charityAccount) => charityAccount.CharityAccountId !== charityAccId
        );

        try {
            
            const { status } = await deleteCharityAccount(charityAccId);
           
            if (status === 200) {
                toast.success("رکورد با موفقیت حذف شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            } 
            
            await dispatch({
                type: "CLEAR_CHARITYACC",
                payload: [...filteredCharityAccounts]
            });
            
        } catch (ex) {
            console.log(ex);
            await dispatch({ type: "CLEAR_CHARITYACC", payload: [...charityAccounts] });
        }
    };
};
