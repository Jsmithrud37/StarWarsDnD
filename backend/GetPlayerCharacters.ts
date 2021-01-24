// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { Connection } from 'mongoose';
import { PlayerCharacter } from './characters/PlayerCharacterSchema';
import { playerSchema, databaseName } from './players';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';

const collectionName = 'player-characters';

/*
TODO: split out query logic from handler so it can be re-used
*/

/**
 * Gets the player characters associated with the provided user name.
 * Netlify function.
 * Requires the following under `event.queryStringParameters`:
 * - userName: the player user name for which player characters will be found.
 */
async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const parameters = event.queryStringParameters;

	if (!parameters.userName) {
		return errorResponse(new Error('Caller did not specify `userName` parameter in query.'));
	}

	try {
		const playerCharacters = await getPlayerCharacters(parameters.userName);
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
export async function getPlayerCharacters(userName: string): Promise<PlayerCharacter> {
	const playerCharacters = await withDbConnection(databaseName, async (db: Connection) => {
		const model = db.model('PlayerCharacter', playerSchema, collectionName);

		console.log('Retrieved players collection.');
		console.log('Querying for results...');
		const playerCharacters = await model
			.find({
				player: userName,
			})
			.sort({ name: 1 });

		console.log(`Found ${playerCharacters.length} characters belonging to ${userName}.`);

		return playerCharacters;
	});

	if (!playerCharacters) {
		throw new Error(`No characters found for user ${playerCharacters}.`);
	}
	return playerCharacters;
}

exports.handler = handler;