import { SchemaDefinition } from 'mongoose';

/**
 * TODO: dedup with front-end counterpart
 */
export interface InventoryItemBase {
	name: string;
	type: string;
	weight: number;
	cost: number;
	stock: number;
	resourceUrl?: string;
}

export const inventoryItemBaseSchema: SchemaDefinition = {
	name: { type: String, required: true },
	type: { type: String, required: true },
	weight: { type: Number, required: true },
	cost: { type: Number, required: true },
	stock: { type: Number, required: true },
	resourceUrl: { type: String, required: false },
};
