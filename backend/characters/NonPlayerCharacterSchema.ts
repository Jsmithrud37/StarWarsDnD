import { Schema } from 'mongoose';
import { CharacterBase, characterBaseSchemaInnards, schemaOptions } from './CharacterSchema';

export const nonPlayerCharacterSchemaInnards =
	characterBaseSchemaInnards &&
	{
		// TODO?
	};

/**
 * DB Schema for a Non-Player-Character entry.
 */
export const nonPlayerCharacterSchema = new Schema(nonPlayerCharacterSchemaInnards, schemaOptions);

/**
 * Data type corresponding to {@link nonPlayerCharacterSchema}
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NonPlayerCharacter extends CharacterBase {
	// TODO
}
