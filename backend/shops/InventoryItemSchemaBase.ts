import { SchemaDefinition } from 'mongoose';

export const inventoryItemBaseSchema: SchemaDefinition = {
	name: { type: String, required: true },
	type: { type: String, required: true },
	weight: { type: Number, required: true },
	cost: { type: Number, required: true },
	stock: { type: Number, required: true },
};
