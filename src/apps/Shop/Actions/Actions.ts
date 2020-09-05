import { ChangeShop, ChangeShopFunction } from './ChangeShop';
import { LoadInventory, LoadInventoryFunction } from './LoadInventory';

/**
 * Collection of action interfaces used by the Datapad app component.
 */
export type ShopActionTypes = ChangeShop | LoadInventory;

/**
 * Collection of action functions supported by the Datapad app component.
 */
export interface Actions {
	/**
	 * {@inheritdoc ChangeShopFunction}
	 */
	changeShop: ChangeShopFunction;

	/**
	 * {@inheritdoc LoadInventoryFunction}
	 */
	loadInventory: LoadInventoryFunction;
}
