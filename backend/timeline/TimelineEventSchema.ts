import { Schema } from 'mongoose';

export interface TimelineEvent {
	title: string;
	date: string;
	description?: string;
	involvedFactions?: string[];
	kind: string;
}

/**
 * DB Schema for a Timeline Event
 */
export const timelineEventSchema = new Schema(
	{
		title: { type: String, required: true },
		year: { type: Number, required: true },
		day: { type: Number, required: true },
		location: { type: String, required: true },
		description: { type: String, required: false },
		involvedFactions: { type: [String], required: false },
		kind: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);
