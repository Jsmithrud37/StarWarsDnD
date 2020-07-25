import { ChangeShop, ChangeShopFunction } from './ChangeShop';

/**
 * Collection of action interfaces used by the Datapad app component.
 */
export type ShopActionTypes = ChangeShop;

/**
 * Collection of action functions supported by the Datapad app component.
 */
export interface Actions {
	/**
	 * {@inheritdoc ChangeShopFunction}
	 */
	changeShop: ChangeShopFunction;
}
