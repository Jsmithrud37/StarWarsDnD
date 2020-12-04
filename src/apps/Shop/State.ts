import { Reducer } from 'redux';
import { CHANGE_SHOP, LOAD_INVENTORY, ShopActionTypes } from './Actions';
import { Inventory } from './Inventory';
import { ShopId } from './ShopId';

/**
 * State utilized by the Shop app component
 */
export interface AppState {
	shopSelection: ShopId;
	inventory: Map<ShopId, Inventory>;
}

/**
 * Initial state used by the Shop app component
 */
export const initialState: AppState = {
	shopSelection: ShopId.Equipment,
	inventory: new Map<ShopId, Inventory>(),
};

/**
 * {@link https://redux.js.org/basics/reducers | Reducer} for the Shop app component's state
 */
export const reducer: Reducer<AppState, ShopActionTypes> = (
	currentState: AppState | undefined,
	action: ShopActionTypes,
): AppState => {
	if (!currentState) {
		currentState = initialState;
	}
	switch (action.type) {
		case CHANGE_SHOP:
			return {
				...currentState,
				shopSelection: action.newShopSelection,
			};
		case LOAD_INVENTORY:
			const updatedInventoryMap = new Map<ShopId, Inventory>(currentState.inventory);
			if (action.inventory === undefined) {
				updatedInventoryMap.delete(action.shopId);
			} else {
				updatedInventoryMap.set(action.shopId, action.inventory);
			}
			return {
				...currentState,
				inventory: updatedInventoryMap,
			};
		default:
			return currentState;
	}
};
