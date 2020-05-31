/**
 * App node export for Datapad
 */

// import { combineReducers } from 'redux';
import Datapad from './Datapad';
import { datapadReducer } from './State';

export default Datapad;

// TODO: export reducers for apps this app depends on
export const reducers = datapadReducer; //combineReducers([datapadReducer, /* Dependent reducers */]);
