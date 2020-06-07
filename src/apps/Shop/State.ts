import { Reducer } from 'redux';
import { ShopId } from './ShopId';
import { ShopActions, CHANGE_SHOP } from './Actions';

/**
 * State utilized by the Shop app component
 */
export interface AppState {
	shopSelection: ShopId;
}

/**
 * Initial state used by the Shop app component
 */
export const initialState: AppState = {
	shopSelection: ShopId.Equipment,
};

/**
 * {@link https://redux.js.org/basics/reducers | Reducer} for the Shop app component's state
 */
export const reducer: Reducer<AppState, ShopActions> = (
	currentState: AppState | undefined,
	action: ShopActions,
): AppState => {
	if (!currentState) {
		return initialState;
	}
	switch (action.type) {
		case CHANGE_SHOP:
			return {
				...currentState,
				shopSelection: action.newShopSelection,
			};
		default:
			return currentState;
	}
};
