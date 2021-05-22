
export const charityAccReducer = (state = [] , action) => {

    switch(action.type){
        case "GET_CHARITYACC":
            return [...action.payload];
        case "ADD_CHARITYACC":
            return [...action.payload];
        case "UPDATE_CHARITYACC":
            return [...action.payload];
        case "CLEAR_CHARITYACC":
            return [...action.payload];
        default:
            return state;
    }

};