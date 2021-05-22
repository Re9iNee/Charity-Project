
export const personalReducer = (state = [] , action) => {

    switch(action.type){
        case "GET_PERSONAL":
            return [...action.payload];
        case "ADD_PERSONAL":
            return [...action.payload];
        case "UPDATE_PERSONAL":
            return [...action.payload];
        case "CLEAR_PERSONAL":
            return [...action.payload];
        default:
            return state;
    }

};