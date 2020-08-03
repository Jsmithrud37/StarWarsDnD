import { Schema } from 'mongoose';
import { inventoryItemBaseSchema } from './InventoryItemSchemaBase';

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
