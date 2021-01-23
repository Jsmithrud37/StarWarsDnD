import { Schema, SchemaOptions } from 'mongoose';

const schemaOptions: SchemaOptions = {
	timestamps: true,
};

const characterSchemaInnards = {
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
export const characterSchema = new Schema(characterSchemaInnards, schemaOptions);

const playerCharacterSchemaInnards = characterSchemaInnards && {
	player: { type: String, unique: true },
};

/**
 * DB Schema for a Player-Character entry.
 */
export const playerCharacterSchema = new Schema(playerCharacterSchemaInnards, schemaOptions);

const nonPlayerCharacterSchemaInnards =
	characterSchemaInnards &&
	{
		// TODO?
	};

/**
 * DB Schema for a Non-Player-Character entry.
 */
export const nonPlayerCharacterSchema = new Schema(nonPlayerCharacterSchemaInnards, schemaOptions);
