/**
 * Helper function for querying for all contacts, since they are split between 2 collections.
 */

import { Connection, Document, FilterQuery, Model, Schema } from 'mongoose';
import { withDbConnection } from '../utilities/DbConnect';
import { CharacterBase } from './CharacterSchema';

/**
 * Database including all of the contact-related collections.
 * TODO: rename to `contacts`
 */
export const databaseName = 'datapad';

/**
 * Name of the collection containing Player Characters
 */
export const pcCollectionName = 'player-characters';

/**
 * Name of the collection containing Player Characters
 */
export const npcCollectionName = 'non-player-characters';

/**
 * Gets the characters from the specified collection with the specified schema.
 * Note: these must correctly match - the type system will not enforce this.
 * @param collectionName - Name of the character collection
 * @param schema - Schema for the character collection
 * @param knownByCharacterNames - Optional filter to query only for characters known
 * by the specified characters
 */
export async function getCharacters<
	TCharacter extends CharacterBase,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TCharacterSchema extends Schema<Document<any>, Model<Document<any>>>
>(
	collectionName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	schema: TCharacterSchema,
	knownByCharacterNames?: string[],
): Promise<TCharacter[]> {
	const contacts = await withDbConnection(databaseName, async (db: Connection) => {
		const model = db.model('Character', schema, collectionName);

		console.log(`Retrieved "${collectionName}" collection.`);
		console.log('Querying for results...');

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let filter: FilterQuery<any> = {};

		if (knownByCharacterNames) {
			const filterList = [];
			for (const knownByFilter of knownByCharacterNames) {
				filterList.push({
					knownBy: knownByFilter,
				});
			}
			filter = {
				$or: [{ knownBy: { $exists: false } }, { $or: filterList }],
			};
		}

		const contacts = await model.find(filter).sort({ name: 1 });

		console.log(`Found ${contacts.length} results.`);
		return contacts;
	});

	return contacts;
}
