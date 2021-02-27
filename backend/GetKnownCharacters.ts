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

		// If there is no player associated with the username, then they are a guest.
		// Only load characters known by everyone (pass empty knownBy list)
		const userCharacters = player?.characters ?? [];

		// Get known player characters
		const knownPlayerCharacters = await getCharacters<
			PlayerCharacter,
			typeof playerCharacterSchema
		>(pcCollectionName, playerCharacterSchema, userCharacters);

		// Get known non-player characters
		const knownNonPlayerCharacters = await getCharacters<
			NonPlayerCharacter,
			typeof nonPlayerCharacterSchema
		>(npcCollectionName, nonPlayerCharacterSchema, userCharacters);

		console.log(
			`Found ${knownPlayerCharacters.length} player characters known by the user's characters.`,
		);
		console.log(
			`Found ${knownNonPlayerCharacters.length} NPCs known by the user's characters.`,
		);

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
