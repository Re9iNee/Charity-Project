
export const plansReducer = (state = [] , action) => {

    switch(action.type){
        case "GET_PLANS":
            return [...action.payload];
        case "ADD_PLANS":
            return [...action.payload];
        case "UPDATE_PLANS":
            return [...action.payload];
        case "CLEAR_PLANS":
            return [...action.payload];
        default:
            return state;
    }

};