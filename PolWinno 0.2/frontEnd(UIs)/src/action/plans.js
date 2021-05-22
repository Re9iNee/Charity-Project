import { toast } from "react-toastify";
import { deletePlan, getPlan, newPlan, updatePlan } from "../services/tblPlans";



export const getPlans = () => {
    return async dispatch => {
        const {data} = await getPlan();
   
        await dispatch( {type : "GET_PLANS" , payload : data.result.recordsets[0]} );
    }
};


export const createPlan = (plan) => {

    return async (dispatch , getState) => {
        const { data , status} = await newPlan(plan);
       console.log('data' , data);
        if (status === 201) {
            toast.success("رکورد جدید با موفقیت ساخته شد", {
                position: "bottom-right",
                closeOnClick: true
            });
        } 

        await dispatch({
            type: "ADD_PLANS",
            payload: [...getState().plans , data.plan.recordset[0] ]
        });
    }
};



export const updatePlans = (planId , plan) => {
    
    return async (dispatch, getState) => {
        const plans = [...getState().plans];
        const filteredPlans = plans.filter(
            (Plan) => Plan.PlanId !== planId
        );
     
        try {
            const { data, status } = await updatePlan( planId , plan );

            if (status === 200) {
                toast.success("رکورد با موفقیت ویرایش شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            }

            await dispatch({
                type: "UPDATE_PLANS",
                payload: [...filteredPlans, data.plan.recordset[0]],
            });

        } catch (ex) {
            await dispatch({ type: "UPDATE_PLANS", payload: [...plans] });
            console.log(ex);
        }
    };
};



export const clearPlan  = (planId) => {

    return async (dispatch, getState) => {
        const plans = [...getState().plans];
        const filteredPlans = plans.filter(
            (Plan) => Plan.PlanId !== planId
        );

        try {
            
            const { status } = await deletePlan(planId);
           
            if (status === 200) {
                toast.success("رکورد با موفقیت حذف شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            } 
            
            await dispatch({
                type: "CLEAR_PLANS",
                payload: [...filteredPlans]
            });
            
        } catch (ex) {
            console.log(ex);
            await dispatch({ type: "CLEAR_PLANS", payload: [...plans] });
        }
    };
};


