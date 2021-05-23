import { combineReducers } from "redux";
import {cmnBaseTypeReducer} from './cmnBaseTypeReducer';
import {cmnBaseDataReducer} from './cmnBaseDataReducer';
import {charityAccReducer} from './charityAccReducer';
import {plansReducer} from './plans';
import {personalReducer} from './personal';
import {assNeedyToPlanReducer} from './assNeedyToPlans';

export const reducers = combineReducers( {
    baseType : cmnBaseTypeReducer ,
    baseData : cmnBaseDataReducer ,
    charityAccount :  charityAccReducer ,
    plans : plansReducer ,
    persons : personalReducer ,
    assignNeedyToPlans : assNeedyToPlanReducer
} )