import { Schema } from 'mongoose';
import { CharacterBase, characterBaseSchemaInnards, schemaOptions } from './CharacterSchema';

export const playerCharacterSchemaInnards = characterBaseSchemaInnards && {
	player: { type: String, unique: true },
};

/**
 * DB Schema for a Player-Character entry.
 */
export const playerCharacterSchema = new Schema(playerCharacterSchemaInnards, schemaOptions);

/**
 * Data type corresponding to {@link playerCharacterSchema}
 */
export interface PlayerCharacter extends CharacterBase {
	player: string;
}
