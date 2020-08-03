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
