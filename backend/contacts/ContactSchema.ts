import { Schema } from 'mongoose';

/**
 * DB Schema for a Contact entry.
 */
export const contactSchema = new Schema(
	{
		name: { type: String, required: true },
		race: { type: String, required: false },
		gender: { type: String, required: false },
		affiliations: { type: [String], required: false },
	},
	{
		timestamps: true,
	},
);
