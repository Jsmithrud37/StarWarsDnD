import { Inventory } from '../Inventory';
import { ShopId } from '../ShopId';

/**
 * Dispatch ID for the LoadInventory action
 */
export const LOAD_INVENTORY = 'LOAD_INVENTORY';

/**
 * Typed dispatch ID for the LoadInventory action
 */
export type LOAD_INVENTORY = typeof LOAD_INVENTORY;

/**
 * LoadInventory action interface
 */
export interface LoadInventory {
	type: LOAD_INVENTORY;
	shopId: ShopId;
	inventory: Inventory;
}

/**
 * LoadInventory {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function loadInventory(shopId: ShopId, inventory: Inventory): LoadInventory {
	return {
		type: LOAD_INVENTORY,
		shopId,
		inventory,
	};
}

/**
 * Loads shop inventory.
 */
export type LoadInventoryFunction = (shopId: ShopId, inventory: Inventory) => void;
