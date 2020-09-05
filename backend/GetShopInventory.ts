// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Connection } from 'mongoose';
import { databaseName, getShopName, getSchema as getShopSchema, getCollectionName } from './shops';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';

/**
 * Gets the item inventory from the specified
 * Netlify function.
 */
async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const parameters = event.queryStringParameters;

	if (!parameters.shopName) {
		throw new Error('Caller did not specify `shopName` parameter in query.');
	}

	const shopName = getShopName(parameters.shopName);

	console.log(`Loading inventory from shop: ${shopName}`);

	try {
		const inventory = await withDbConnection(databaseName, async (db: Connection) => {
			const schema = getShopSchema(shopName);
			const collectionName = getCollectionName(shopName);
			const model = db.model('Contact', schema, collectionName);

			console.log(`Retrieved ${collectionName} shop collection.`);
			console.log('Querying for results...');
			const inventory = await model.find().sort({ name: 1 });

			console.log(`Found ${inventory.length} results.`);
			return inventory;
		});

		const resultBody = {
			shopName,
			inventory,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

exports.handler = handler;
