// src/store/rootReducer.js
import { combineReducers } from 'redux';
import evenementReducer from './evenementReducer';

const rootReducer = combineReducers({
  evenements: evenementReducer,
});

export default rootReducer;