import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { Connection } from 'mongoose';
import { playerSchema, databaseName, collectionName, Player } from './players';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';

/**
 * Gets the player associated with the provided user name.
 * Netlify function.
 * Requires the following under `event.queryStringParameters`:
 * - userName: the name of the user player
 */
async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const parameters = event.queryStringParameters;

	if (!parameters.userName) {
		return errorResponse(new Error('Caller did not specify `userName` parameter in query.'));
	}

	try {
		const player: Player | undefined = await getPlayer(parameters.userName);
		if (!player) {
			return errorResponse(
				new Error('No player found associated with the specified username.'),
			);
		}

		const resultBody = {
			player,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

/**
 * Gets the player associated with the specified user name.
 */
export async function getPlayer(userName: string): Promise<Player | undefined> {
	const player = await withDbConnection(databaseName, async (db: Connection) => {
		const model = db.model('Player', playerSchema, collectionName);

		console.log('Retrieved players collection.');
		console.log('Querying for results...');
		const players: Player[] = await model.find({ userName: userName });

		if (!players || players.length === 0) {
			console.log('No player found associated with the specified username.');
			return undefined;
		}

		if (players.length > 1) {
			throw new Error(
				'Multiple players found for the same `userName`. This should not be possible.',
			);
		}
		console.log(`Player found!`);

		return players[0];
	});
	return player;
}

exports.handler = handler;
