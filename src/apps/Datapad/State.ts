import { Reducer } from 'redux';
import { ShopId } from '../Shop';
import { CHANGE_APP, CHANGE_SHOP, COLLAPSE_MENU, DatapadActions, EXPAND_MENU } from './Actions';
import AppId from './AppId';

/**
 * State utilized by the Datapad app component
 */
export interface AppState {
	appSelection: AppId;
	shopSelection: ShopId;
	isMenuCollapsed: boolean;
}

/**
 * Initial state used by the Datapad app component
 */
export const initialState: AppState = {
	appSelection: AppId.GalaxyMap,
	shopSelection: ShopId.Equipment,
	isMenuCollapsed: false,
};

/**
 * {@link https://redux.js.org/basics/reducers | Reducer} for the Datapad app component's state
 */
export const datapadReducer: Reducer<AppState, DatapadActions> = (
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
		case CHANGE_SHOP:
			return {
				...currentState,
				// If a user manages to click on one of the sub-menus while the shops menu is animating shut,
				// switch back to shops menu
				appSelection: AppId.Shops,
				shopSelection: action.newShopSelection,
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
