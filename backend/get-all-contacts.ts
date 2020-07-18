// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyResult } from 'aws-lambda';
import Contact from './models/Contact.model';

/**
 * Gets all contacts from the database.
 * Netlify function.
 */
async function getContactsHandler(): Promise<APIGatewayProxyResult> {
	try {
		const rawResults = Contact.find();
		const sortedResults = await rawResults.sort({ name: 1 }); // Sort ascending by contact name
		const resultBody = JSON.stringify({
			contacts: sortedResults,
		});
		return {
			statusCode: 200,
			body: resultBody,
		};
	} catch (error) {
		return { statusCode: 500, body: error.toString() };
	}
}

exports.handler = getContactsHandler;
