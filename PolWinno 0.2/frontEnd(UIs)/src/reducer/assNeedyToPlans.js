
export const assNeedyToPlanReducer = (state = [] , action) => {

    switch(action.type){
        case "GET_assNeedyToPlan":
            return [...action.payload];
        case "ADD_assNeedyToPlan":
            return [...action.payload];
        case "CLEAR_assNeedyToPlan":
            return [...action.payload];
        default:
            return state;
    }

};