import { Schema } from 'mongoose';
import { inventoryItemBaseSchema, InventoryItemBase } from './InventoryItemSchemaBase';

/**
 * TODO: de-duplicate with front end counterpart
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EquipmentItem extends InventoryItemBase {}

/**
 * DB Schema for items in the Equipment shop inventory.
 */
export const equipmentItemSchema = new Schema(
	{
		...inventoryItemBaseSchema,
		// TODO: equipment-specific metadata here.
	},
	{
		timestamps: true,
	},
);
