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

	if (!parameters.itemName) {
		throw new Error('Caller did not specify `itemName` parameter in query.');
	}

	const shopName = getShopName(parameters.shopName);
	const itemName = parameters.itemName;

	console.log(`Deleting item "${itemName} from shop: ${shopName}`);

	try {
		await withDbConnection(databaseName, async (db: Connection) => {
			const schema = getShopSchema(shopName);
			const collectionName = getCollectionName(shopName);
			const model = db.model('InventoryItem', schema, collectionName);

			console.log(`Deleting item from ${collectionName} shop collection...`);

			try {
				await model.deleteOne({ name: itemName });
			} catch (error) {
				console.error('Encountered an error while deleting item:');
				console.group();
				console.log(error);
				console.groupEnd();
				throw error;
			}

			console.log(`Item Deleted!`);
		});

		const resultBody = {
			shopName: parameters.shopName,
			item: parameters.item,
		};

		return successResponse(resultBody);
	} catch (error) {
		return errorResponse(error);
	}
}

exports.handler = handler;
