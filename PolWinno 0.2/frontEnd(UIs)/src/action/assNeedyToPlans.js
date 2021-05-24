import { toast } from "react-toastify";
import { deleteAssignNeedyToPlan, getAssignNeedyToPlan, newAssignNeedyToPlan } from "../services/tblAssignNeedyToPlans";



export const getAssignNeedyToPlans = () => {
    return async dispatch => {
        const {data} = await getAssignNeedyToPlan();
     
        await dispatch( {type : "GET_assNeedyToPlan" , payload : data.result.recordsets[0]} );
    }
};


export const createAssignNeedyToPlans = (assignNeedyPlan) => {
    return async (dispatch , getState) => {
        const { data , status} = await newAssignNeedyToPlan(assignNeedyPlan);
      
        if (status === 201) {
            toast.success("رکورد جدید با موفقیت ساخته شد", {
                position: "bottom-right",
                closeOnClick: true
            });
        } 

        await dispatch({
            type: "ADD_assNeedyToPlan",
            payload: [...getState().assignNeedyToPlans , data.assignNeedyToPlans.recordset[0] ]
        });
    }
};


export const clearAssignNeedyToPlans  = (assignNeedyPlanId) => {

    return async (dispatch, getState) => {
        const assignNeedyToPlans = [...getState().assignNeedyToPlans];
        const filteredAssignNeedyToPlans = assignNeedyToPlans.filter(
            (assignNeedyToPlan) => assignNeedyToPlan.AssignNeedyPlanId !== assignNeedyPlanId
        );

        try {
            
            const { status } = await deleteAssignNeedyToPlan(assignNeedyPlanId);
           
            if (status === 200) {
                toast.success("رکورد با موفقیت حذف شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            } 
            
            await dispatch({
                type: "CLEAR_assNeedyToPlan",
                payload: [...filteredAssignNeedyToPlans]
            });
            
        } catch (ex) {
            console.log(ex);
            await dispatch({ type: "CLEAR_assNeedyToPlan", payload: [...assignNeedyToPlans] });
        }
    };
};
