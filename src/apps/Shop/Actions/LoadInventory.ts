import { Inventory } from '../InventoryItem';

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
	inventory: Inventory;
}

/**
 * LoadInventory {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function loadInventory(inventory: Inventory): LoadInventory {
	return {
		type: LOAD_INVENTORY,
		inventory,
	};
}

/**
 * Loads shop inventory.
 */
export type LoadInventoryFunction = (inventory: Inventory) => void;
