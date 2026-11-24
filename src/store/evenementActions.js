
import {
    GET_EVENEMENTS,
    ADD_EVENEMENT,
    UPDATE_EVENEMENT,
    DELETE_EVENEMENT
} from "./actiontypes";

export const getEvenements = (evenements) => ({
    type: GET_EVENEMENTS,
    payload: evenements
});

export const addEvenement = (evenement) => ({
    type: ADD_EVENEMENT,
    payload: evenement
});

export const updateEvenement = (evenement) => ({
    type: UPDATE_EVENEMENT,
    payload: evenement
});

export const deleteEvenement = (id) => ({
    type: DELETE_EVENEMENT,
    payload: id
});
