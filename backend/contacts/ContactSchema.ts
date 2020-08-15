import { Schema } from 'mongoose';

/**
 * DB Schema for a Contact entry.
 */
export const contactSchema = new Schema(
	{
		name: { type: String, unique: true },
		species: { type: String, required: false },
		gender: { type: String, required: false },
		homeworld: { type: String, required: false },
		affiliations: { type: [String], required: false },
		status: { type: String, required: false },
		bio: { type: String, required: false },
	},
	{
		timestamps: true,
	},
);
