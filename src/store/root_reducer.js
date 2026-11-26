import { combineReducers } from 'redux';
import organisateur_reducer from './organisateur/organisateur_reducer';

const rootReducer = combineReducers({
  organisateur: organisateur_reducer,
});

export default rootReducer;