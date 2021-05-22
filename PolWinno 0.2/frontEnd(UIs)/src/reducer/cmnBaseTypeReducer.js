
export const cmnBaseTypeReducer = (state = [] , action) => {

    switch(action.type){
        case "GET_BASETYPE":
            return [...action.payload];
        case "ADD_BASETYPE":
            return [...action.payload];
        case "UPDATE_BASETYPE":
            return [...action.payload];
        case "CLEAR_BASETYPE":
            return [...action.payload];
        default:
            return state;
    }

};