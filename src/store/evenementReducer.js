
import {
    GET_EVENEMENTS,
    ADD_EVENEMENT,
    UPDATE_EVENEMENT,
    DELETE_EVENEMENT
} from "./actiontypes";

const initialState = {
    evenements: []
};

function evenementReducer(state = initialState, action) {
    switch (action.type) {

        case GET_EVENEMENTS:
            return {
                ...state,
                evenements: action.payload
            };

        case ADD_EVENEMENT:
            return {
                ...state,
                evenements: [...state.evenements, action.payload]
            };

        case UPDATE_EVENEMENT:
            return {
                ...state,
                evenements: state.evenements.map(e =>
                    e.id === action.payload.id ? action.payload : e
                )
            };

        case DELETE_EVENEMENT:
            return {
                ...state,
                evenements: state.evenements.filter(
                    e => e.id !== action.payload
                )
            };

        default:
            return state;
    }
}

export default evenementReducer;
