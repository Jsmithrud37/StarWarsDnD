import { Schema } from 'mongoose';
import { inventoryItemBaseSchema } from './InventoryItemSchemaBase';

/**
 * DB Schema for items in the Apothecary shop inventory.
 */
export const apothecaryItemSchema = new Schema(
	{
		...inventoryItemBaseSchema,
		// TODO: apothecary-specific metadata here.
	},
	{
		timestamps: true,
	},
);
