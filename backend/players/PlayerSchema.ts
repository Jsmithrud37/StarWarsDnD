import { Schema } from 'mongoose';

/**
 * DB Schema for a Player entry.
 */
export const playerSchema = new Schema(
	{
		userName: { type: String, unique: true },
		playerKind: { type: String, required: true, unique: false },
		characters: { type: [String], required: false, unique: false },
	},
	{
		timestamps: true,
	},
);

/**
 * Data type corresponding with {@link playerSchema}
 */
export interface Player {
	userName: string;
	playerKind: string;
	characters?: string[];
}
