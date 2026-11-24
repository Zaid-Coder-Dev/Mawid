
import { combineReducers } from "redux";
import evenementReducer from "./evenementReducer";

const rootReducer = combineReducers({
    evenementState: evenementReducer
});

export default rootReducer;
