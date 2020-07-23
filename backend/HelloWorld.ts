// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

const helloWorldHandler: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (
	event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
	try {
		const message = createMessage(event.queryStringParameters.name);
		return {
			statusCode: 200,
			body: JSON.stringify({ message }),
			// // more keys you can return:
			// headers: { "headerName": "headerValue", ... },
			// isBase64Encoded: true,
		};
	} catch (err) {
		return { statusCode: 500, body: err.toString() };
	}
};

/**
 * Generates the hello message to the specified subject.
 */
function createMessage(subject?: string): string {
	return `Hello ${subject ?? 'World'}`;
}

exports.handler = helloWorldHandler;
