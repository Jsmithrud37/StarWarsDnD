import { Reducer } from 'redux';
import { CHANGE_SHOP, LOAD_INVENTORY, ShopActionTypes } from './Actions';
import { Inventory } from './InventoryItem';
import { ShopId } from './ShopId';

/**
 * State utilized by the Shop app component
 */
export interface AppState {
	shopSelection: ShopId;
	inventory?: Inventory;
}

/**
 * Initial state used by the Shop app component
 */
export const initialState: AppState = {
	shopSelection: ShopId.Equipment,
	inventory: undefined,
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
				inventory: undefined, // Set the inventory back to empty to trigger reload
			};
		case LOAD_INVENTORY:
			return {
				...currentState,
				inventory: action.inventory,
			};
		default:
			return currentState;
	}
};
