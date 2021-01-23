// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyResult } from 'aws-lambda';
import { Connection } from 'mongoose';
import { databaseName, playerCharacterSchema, nonPlayerCharacterSchema } from './characters';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';

const pcCollectionName = 'player-characters';
const npcCollectionName = 'non-player-characters';

/*
TODO: split out query logic from handler so it can be re-used
*/

/**
 * Gets all known characters from the database.
 * Used to get all contacts for when the app is viewed by the DM.
 * Netlify function.
 */
async function handler(): Promise<APIGatewayProxyResult> {
	// Get player characters
	try {
		const playerCharacters = await getCharacters(pcCollectionName, playerCharacterSchema);
		const nonPlayerCharacters = await getCharacters(
			npcCollectionName,
			nonPlayerCharacterSchema,
		);

		const allCharacters = [...playerCharacters, ...nonPlayerCharacters];

		const resultBody = {
			characters: allCharacters,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

/**
 * Helper function for querying for all contacts, since they are split between 2 collections.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCharacters(collectionName: string, schema: any): Promise<any> {
	const contacts = await withDbConnection(databaseName, async (db: Connection) => {
		const model = db.model('Character', schema, collectionName);

		console.log(`Retrieved ${collectionName} collection.`);
		console.log('Querying for results...');
		const contacts = await model.find().sort({ name: 1 });

		console.log(`Found ${contacts.length} results.`);
		return contacts;
	});

	return contacts;
}

exports.handler = handler;
