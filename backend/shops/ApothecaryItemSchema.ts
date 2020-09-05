import { Schema } from 'mongoose';
import { inventoryItemBaseSchema, InventoryItemBase } from './InventoryItemSchemaBase';

/**
 * TODO: de-duplicate with front end counterpart
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApothecaryItem extends InventoryItemBase {}

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
