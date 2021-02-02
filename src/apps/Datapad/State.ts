import { Reducer } from 'redux';
import { CHANGE_APP, COLLAPSE_MENU, DatapadActions, EXPAND_MENU, SET_PLAYER } from './Actions';
import AppId from './AppId';
import { Player } from './Player';

/**
 * State utilized by the Datapad app component
 */
export interface AppState {
	/**
	 * Signed in player.
	 * If not present, means that the player needs to be fetched from the backend.
	 */
	signedInPlayer?: Player;

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
	signedInPlayer: undefined,
	appSelection: AppId.Profile,
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
		case SET_PLAYER:
			return {
				...currentState,
				signedInPlayer: action.player,
			};
		default:
			return currentState;
	}
};
