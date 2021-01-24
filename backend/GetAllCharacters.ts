// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyResult } from 'aws-lambda';
import { getCharacters, npcCollectionName, pcCollectionName } from './characters';
import { nonPlayerCharacterSchema } from './characters/NonPlayerCharacterSchema';
import { playerCharacterSchema } from './characters/PlayerCharacterSchema';
import { errorResponse, successResponse } from './utilities/Responses';

/**
 * Gets all contacts from the database.
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

		const resultBody = {
			playerCharacters: playerCharacters,
			nonPlayerCharacters: nonPlayerCharacters,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

exports.handler = handler;
