// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Connection, Schema } from 'mongoose';
import { apothecaryItemSchema, databaseName, equipmentItemSchema, ShopName } from './shops';
import { withDbConnection } from './utilities/DbConnect';
import { errorResponse, successResponse } from './utilities/Responses';

/**
 * Converts the provided shop name string to one of the supported shop name values.
 * If not valid, throws.
 */
function getShopName(shopName: string): ShopName {
	if (!Object.keys(ShopName).includes(shopName)) {
		throw new Error(`Shop '${shopName}' does not exist.`);
	}
	return shopName as ShopName;
}

/**
 * Gets the MongoDB collection for the specified shop.
 */
function getCollectionName(shopName: ShopName): string {
	// ShopName string representation is set to 1-on-1 match with collection names.
	return shopName;
}

/**
 * Gets the inventory item schema for the specified shop.
 */
function getSchema(shopName: ShopName): Schema {
	switch (shopName) {
		case ShopName.Apothecary:
			return apothecaryItemSchema;
		case ShopName.Equipment:
			return equipmentItemSchema;
		default:
			throw new Error(`Unrecognized shop name: ${shopName}`);
	}
}

/**
 * Gets the item inventory from the specified
 * Netlify function.
 */
async function getShopInventoryHandler(
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
	const parameters = event.queryStringParameters;

	if (!parameters.shopName) {
		throw new Error('Caller did not specify `shopName` parameter in query.');
	}

	const shopName = getShopName(parameters.shopName);

	console.log(`Loading inventory from shop: ${shopName}`);

	try {
		const inventory = await withDbConnection(databaseName, async (db: Connection) => {
			const schema = getSchema(shopName);
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

exports.handler = getShopInventoryHandler;
