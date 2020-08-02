import { Reducer } from 'redux';
import { CHANGE_APP, COLLAPSE_MENU, DatapadActions, EXPAND_MENU } from './Actions';
import AppId from './AppId';

/**
 * State utilized by the Datapad app component
 */
export interface AppState {
	/**
	 * Currently selected application.
	 */
	appSelection: AppId;

	/**
	 * Whether or not the side-bar menu is hidden (collapsed), or visible.
	 */
	isMenuCollapsed: boolean;
}

/**
 * Initial state used by the Datapad app component
 */
export const initialState: AppState = {
	appSelection: AppId.GalaxyMap,
	isMenuCollapsed: false,
};

/**
 * {@link https://redux.js.org/basics/reducers | Reducer} for the Datapad app component's state
 */
export const reducer: Reducer<AppState, DatapadActions> = (
	currentState: AppState | undefined,
	action: DatapadActions,
): AppState => {
	if (!currentState) {
		return initialState;
	}
	switch (action.type) {
		case CHANGE_APP:
			return {
				...currentState,
				appSelection: action.newAppSelection,
			};
		case COLLAPSE_MENU:
			return {
				...currentState,
				isMenuCollapsed: true,
			};
		case EXPAND_MENU:
			return {
				...currentState,
				isMenuCollapsed: false,
			};
		default:
			return currentState;
	}
};
