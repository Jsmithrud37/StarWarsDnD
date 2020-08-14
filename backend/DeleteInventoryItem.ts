// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Connection } from 'mongoose';
import { databaseName, getShopName, getSchema as getShopSchema, getCollectionName } from './shops';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';
import { InventoryItemBase } from './shops/InventoryItemSchemaBase';

/**
 * Gets the item inventory from the specified
 * Netlify function.
 */
async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const parameters = event.queryStringParameters;

	if (!parameters.shopName) {
		throw new Error('Caller did not specify `shopName` parameter in query.');
	}

	if (!parameters.item) {
		throw new Error('Caller did not provide an item to insert.');
	}

	const shopName = getShopName(parameters.shopName);

	const newItem = JSON.parse(parameters.item) as InventoryItemBase;

	console.log(`Loading inventory from shop: ${shopName}`);

	try {
		await withDbConnection(databaseName, async (db: Connection) => {
			const schema = getShopSchema(shopName);
			const collectionName = getCollectionName(shopName);
			const model = db.model('Contact', schema, collectionName);

			console.log(
				`Inserting item "${newItem.name}" into ${collectionName} shop collection...`,
			);

			// TODO: find single insert option?
			try {
				await model.insertMany([newItem]);
			} catch (error) {
				console.error('Encountered an error while inserting item:');
				console.group();
				console.log(error);
				console.groupEnd();
				throw error;
			}

			console.log(`Item inserted!`);
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
