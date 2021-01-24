import { Schema, SchemaOptions } from 'mongoose';

export const schemaOptions: SchemaOptions = {
	timestamps: true,
};

export const characterBaseSchemaInnards = {
	name: { type: String, unique: true },
	species: { type: String, required: false },
	speciesUrl: { type: String, required: false },
	gender: { type: String, required: false },
	homeworld: { type: String, required: false },
	homeworldUrl: { type: String, required: false },
	affiliations: { type: [String], required: false },
	status: { type: String, required: false },
	bio: { type: String, required: false },
	knownBy: { type: [String], required: false },
};

/**
 * DB Schema for a Character entry.
 */
export const characterBaseSchema = new Schema(characterBaseSchemaInnards, schemaOptions);

/**
 * Data type corresponding to {@link characterBaseSchema}
 */
export interface CharacterBase {
	name: string;
	species?: string;
	speciesUrl?: string;
	gender?: string;
	homeworld?: string;
	homeworldUrl?: string;
	affiliations?: string[];
	status?: string;
	bio?: string;
	knownBy?: string[];
}
