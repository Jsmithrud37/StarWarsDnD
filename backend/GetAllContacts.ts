// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyResult } from 'aws-lambda';
import { Connection } from 'mongoose';
import { collectionName, contactSchema } from './contacts';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';

/**
 * Gets all contacts from the database.
 * Netlify function.
 */
async function getContactsHandler(): Promise<APIGatewayProxyResult> {
	try {
		const contacts = await withDbConnection(async (db: Connection) => {
			const model = db.model('Contact', contactSchema, collectionName);

			console.log('Retrieved contacts collection.');
			console.log('Querying for results...');
			const contacts = await model.find().sort({ name: 1 });

			console.log(`Found ${contacts.length} results.`);
			return contacts;
		});

		const resultBody = {
			contacts,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

exports.handler = getContactsHandler;
