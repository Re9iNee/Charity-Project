
export const cmnBaseDataReducer = (state = [] , action) => {

    switch(action.type){
        case "GET_BASEDATA":
            return [...action.payload];
        default:
            return state;
    }

};