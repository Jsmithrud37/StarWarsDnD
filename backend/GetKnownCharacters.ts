// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getCharacters, npcCollectionName, pcCollectionName } from './characters';
import {
	NonPlayerCharacter,
	nonPlayerCharacterSchema,
} from './characters/NonPlayerCharacterSchema';
import { PlayerCharacter, playerCharacterSchema } from './characters/PlayerCharacterSchema';
import { getPlayer } from './GetPlayer';
import { Player } from './players';
import { errorResponse, successResponse } from './utilities/Responses';

/**
 * Gets all characters known by the specified character.
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
		const player: Player = await getPlayer(parameters.userName);
		const userCharacters = player.characters;

		let knownPlayerCharacters: PlayerCharacter[];
		let knownNonPlayerCharacters: NonPlayerCharacter[];
		if (userCharacters && userCharacters.length > 0) {
			// Get known player characters
			knownPlayerCharacters = await getCharacters<
				PlayerCharacter,
				typeof playerCharacterSchema
			>(pcCollectionName, playerCharacterSchema, userCharacters);

			// Get known non-player characters
			knownNonPlayerCharacters = await getCharacters<
				NonPlayerCharacter,
				typeof nonPlayerCharacterSchema
			>(npcCollectionName, nonPlayerCharacterSchema, userCharacters);
		} else {
			knownPlayerCharacters = [];
			knownNonPlayerCharacters = [];
		}

		const resultBody = {
			playerCharacters: knownPlayerCharacters,
			nonPlayerCharacters: knownNonPlayerCharacters,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

exports.handler = handler;
