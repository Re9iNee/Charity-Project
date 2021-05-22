import { toast } from "react-toastify";
import { deletePersonalInfo, getPersonalInfo, newPersonalInfo, updatePersonalInfo } from "../services/tblPersonal";



export const getPerson = () => {
    return async dispatch => {
        const {data} = await getPersonalInfo();
   
        await dispatch( {type : "GET_PERSONAL" , payload : data.result.recordsets[0]} );
    }
};


export const createPerson = (person) => {

    return async (dispatch , getState) => {
        const { data , status} = await newPersonalInfo(person);
       console.log('data' , data);
        if (status === 201) {
            toast.success("رکورد جدید با موفقیت ساخته شد", {
                position: "bottom-right",
                closeOnClick: true
            });
        } 

        await dispatch({
            type: "ADD_PERSONAL",
            payload: [...getState().persons , data.person.recordset[0] ]
        });
    }
};



export const updatePerson = (personId , person) => {
    
    return async (dispatch, getState) => {
        const persons = [...getState().persons];
        const filteredPersons = persons.filter(
            (Person) => Person.PersonId !== personId
        );
     
        try {
            const { data, status } = await updatePersonalInfo( personId , person );

            if (status === 200) {
                toast.success("رکورد با موفقیت ویرایش شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            }

            await dispatch({
                type: "UPDATE_PERSONAL",
                payload: [...filteredPersons, data.person.recordset[0]],
            });

        } catch (ex) {
            await dispatch({ type: "UPDATE_PERSONAL", payload: [...persons] });
            console.log(ex);
        }
    };
};



export const clearPerson  = (personId) => {

    return async (dispatch, getState) => {
        const persons = [...getState().persons];
        const filteredPersons = persons.filter(
            (Person) => Person.PersonId !== personId
        );
     

        try {
            
            const { status } = await deletePersonalInfo(personId);
           
            if (status === 200) {
                toast.success("رکورد با موفقیت حذف شد", {
                    position: "bottom-right",
                    closeOnClick: true
                });
            } 
            
            await dispatch({
                type: "CLEAR_PERSONAL",
                payload: [...filteredPersons]
            });
            
        } catch (ex) {
            console.log(ex);
            await dispatch({ type: "CLEAR_PERSONAL", payload: [...persons] });
        }
    };
};


