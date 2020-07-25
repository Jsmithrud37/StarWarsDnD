import { Reducer } from 'redux';
import { CHANGE_SHOP, ShopActionTypes } from './Actions';
import { ShopId } from './ShopId';

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
export const reducer: Reducer<AppState, ShopActionTypes> = (
	currentState: AppState | undefined,
	action: ShopActionTypes,
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
