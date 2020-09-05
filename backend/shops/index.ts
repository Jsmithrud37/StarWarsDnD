import { Schema } from 'mongoose';
import { apothecaryItemSchema } from './ApothecaryItemSchema';
import { equipmentItemSchema } from './EquipmentItemSchema';

export { apothecaryItemSchema } from './ApothecaryItemSchema';
export { equipmentItemSchema } from './EquipmentItemSchema';

/**
 * Name of the MongoDB database containing all of the shops.
 */
export const databaseName = 'shops';

export enum ShopName {
	Apothecary = 'apothecary',
	Equipment = 'equipment',
}

// TODO: find a better way to represent this set.
const shopNames = ['apothecary', 'equipment'];

/**
 * Converts the provided shop name string to one of the supported shop name values.
 * If not valid, throws.
 */
export function getShopName(shopName: string): ShopName {
	if (!shopNames.includes(shopName)) {
		throw new Error(`Shop '${shopName}' does not exist.`);
	}
	return shopName as ShopName;
}

/**
 * Gets the MongoDB collection for the specified shop.
 */
export function getCollectionName(shopName: ShopName): string {
	// ShopName string representation is set to 1-on-1 match with collection names.
	return shopName;
}

/**
 * Gets the inventory item schema for the specified shop.
 */
export function getSchema(shopName: ShopName): Schema {
	switch (shopName) {
		case ShopName.Apothecary:
			return apothecaryItemSchema;
		case ShopName.Equipment:
			return equipmentItemSchema;
		default:
			throw new Error(`Unrecognized shop name: ${shopName}`);
	}
}
