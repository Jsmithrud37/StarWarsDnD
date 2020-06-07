/**
 * ChangeShop action:
 * {@inheritdoc ChangeShopFunction}
 */

import { ShopId } from '../ShopId';

/**
 * Dispatch ID for the ChangeShop action
 */
export const CHANGE_SHOP = 'CHANGE_SHOP';

/**
 * Typed dispatch ID for the ChangeApp action
 */
export type CHANGE_SHOP = typeof CHANGE_SHOP;

/**
 * ChangeShop action interface
 */
export interface ChangeShop {
	type: CHANGE_SHOP;
	newShopSelection: ShopId;
}

/**
 * ChangeShop {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function changeShop(newShopSelection: ShopId): ChangeShop {
	return {
		type: CHANGE_SHOP,
		newShopSelection,
	};
}

/**
 * TODO: remove this - move shop selection into the shop app.
 * Set's the Shop App's shop selection to the one specified.
 * If the shop app is not selected, it will also change the selection to it.
 */
export type ChangeShopFunction = (newShopSelection: ShopId) => void;
