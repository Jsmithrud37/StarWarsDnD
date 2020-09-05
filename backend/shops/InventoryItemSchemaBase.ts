import { SchemaDefinition } from 'mongoose';

/**
 * TODO: dedup with front-end counterpart
 */
export interface InventoryItemBase {
	name: string;
	category: string;
	type: string;
	subType?: string;
	rarity: string;
	weight: number;
	cost: number;
	stock?: number; // undefined => ∞
	resourceUrl?: string;
}

export const inventoryItemBaseSchema: SchemaDefinition = {
	name: { type: String, unique: true },
	category: { type: String, required: true },
	type: { type: String, required: true },
	subType: { type: String, required: false },
	rarity: { type: String, required: true },
	weight: { type: Number, required: true },
	cost: { type: Number, required: true },
	stock: { type: Number, required: false },
	resourceUrl: { type: String, required: false },
};
