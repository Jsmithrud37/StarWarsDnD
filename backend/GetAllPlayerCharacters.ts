// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyResult } from 'aws-lambda';
import { Connection } from 'mongoose';
import { PlayerCharacter, playerCharacterSchema, databaseName } from './characters';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';

const collectionName = 'player-characters';

/**
 * Gets all player characters.
 * Netlify function.
 */
async function handler(): Promise<APIGatewayProxyResult> {
	try {
		const playerCharacters = await getPlayerCharacters();
		const resultBody = {
			characters: playerCharacters,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

/**
 * Queries the database for all characters belonging to the specified user.
 */
export async function getPlayerCharacters(): Promise<PlayerCharacter[]> {
	const playerCharacters = await withDbConnection(databaseName, async (db: Connection) => {
		const model = db.model('PlayerCharacter', playerCharacterSchema, collectionName);

		console.log(`Retrieved ${collectionName} collection.`);
		console.log('Querying for results...');
		const playerCharacters: PlayerCharacter[] = await model.find().sort({ name: 1 });

		console.log(`Found ${playerCharacters.length} characters.`);

		return playerCharacters;
	});

	if (!playerCharacters) {
		throw new Error(`No characters found for user ${playerCharacters}.`);
	}
	return playerCharacters;
}

exports.handler = handler;
