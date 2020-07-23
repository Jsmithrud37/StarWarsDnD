import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Error response helper for Netlify functions.
 */
export function errorResponse(error: Error): APIGatewayProxyResult {
	console.error(error);
	return {
		statusCode: 500,
		body: JSON.stringify(error.message),
	};
}

/**
 * Success response helper for Netlify functions.
 */
export function successResponse(body: object): APIGatewayProxyResult {
	return {
		statusCode: 200,
		body: JSON.stringify(body),
	};
}
