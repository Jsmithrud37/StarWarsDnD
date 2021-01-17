// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { Connection } from 'mongoose';
import { playerSchema, databaseName, collectionName } from './players';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';

/**
 * Gets the player associated with the provided user name.
 * Netlify function.
 */
async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const parameters = event.queryStringParameters;

	if (!parameters.userName) {
		return errorResponse(new Error('Caller did not specify `userName` parameter in query.'));
	}
	const queryUserName = parameters.userName.toLocaleLowerCase();

	try {
		const player = await withDbConnection(databaseName, async (db: Connection) => {
			const model = db.model('Player', playerSchema, collectionName);

			console.log('Retrieved players collection.');
			console.log('Querying for results...');
			const players = await model.find().sort({ name: 1 });

			console.log(`Found ${players.length} results.`);

			console.log(`Searching for specified player...`);

			let player = undefined;
			players.forEach((currentPlayer) => {
				const currentUserName = (currentPlayer.userName as string).toLocaleLowerCase();
				if (queryUserName === currentUserName) {
					console.log('Specified player found!');
					player = currentPlayer;
				}
			});

			return player;
		});

		if (!player) {
			return errorResponse(new Error('Specified player not found. Adding to database...'));
		}

		const resultBody = {
			player,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

exports.handler = handler;
