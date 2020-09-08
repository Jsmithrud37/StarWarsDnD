import { Reducer } from 'redux';
import { TimelineEvent } from './TimelineEvent';
import { TimelineActionTypes, LOAD_EVENTS } from './Actions';

/**
 * State utilized by the Timeline app component
 */
export interface AppState {
	events?: TimelineEvent[];
}

/**
 * Initial state used by the Timeline app component
 */
export const initialState: AppState = {
	events: undefined,
};

/**
 * {@link https://redux.js.org/basics/reducers | Reducer} for the Timeline app component's state
 */
export const reducer: Reducer<AppState, TimelineActionTypes> = (
	currentState: AppState | undefined,
	action: TimelineActionTypes,
): AppState => {
	if (!currentState) {
		currentState = initialState;
	}
	switch (action.type) {
		case LOAD_EVENTS:
			return {
				...currentState,
				events: action.events,
			};
		default:
			return currentState;
	}
};
