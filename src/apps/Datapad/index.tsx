/**
 * App node export for Datapad
 */

import { combineReducers } from 'redux';
import Datapad from './Datapad';
import datapadReducer from './State';

export default Datapad;

export * from './State';

// TODO: export reducers for apps this app depends on
export const reducers = combineReducers(datapadReducer /*, Dependent reducers */);
