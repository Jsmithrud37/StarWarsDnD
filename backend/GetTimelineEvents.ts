// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyResult } from 'aws-lambda';
import { Connection } from 'mongoose';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';
import { timelineEventSchema } from './timeline/TimelineEventSchema';

const databaseName = 'timeline';
const collectionName = 'events';

/**
 * Gets all timeline events from the database.
 * Netlify function.
 */
async function handler(): Promise<APIGatewayProxyResult> {
	try {
		const events = await withDbConnection(databaseName, async (db: Connection) => {
			const model = db.model('TimelineEvent', timelineEventSchema, collectionName);

			console.log('Retrieved timeline events.');
			console.log('Querying for results...');
			const events = await model.find().sort({ year: -1, day: 1 });

			console.log(`Found ${events.length} results.`);
			return events;
		});

		const resultBody = {
			events,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

exports.handler = handler;
