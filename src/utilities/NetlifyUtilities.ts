/**
 * Base url of the Netlify backend.
 */
export const urlBase = '/.netlify/functions/';

/**
 * Parameters to the backend query.
 * Will be url-encoded before being sent to the backend.
 */
export interface QueryParameter {
	name: string;
	value: string | number | boolean;
}

/**
 * Result from a backend query. Will either be a valid query result, or will be `false`,
 * indicating that an error occurred when executing the query.
 */
export type QueryResult<T> = T | false;

/**
 * Runs the specified backend query function with the specified query parameters.
 * @arg functionName - Name of the backend function to query. Must be non-empty,
 * and must correspond to a valid backend function.
 * @arg queryParameters - Query parameters to be sent to the backend
 */
export async function executeBackendFunction<T = never>(
	functionName: string,
	queryParameters?: QueryParameter[],
): Promise<QueryResult<T>> {
	if (functionName.length === 0) {
		throw new Error('Cannot process empty query function.');
	}

	const functionUrl = generateFunctionUrl(functionName, queryParameters);

	// TODO: either return full response, or handle errors here.
	const response = await fetch(functionUrl);

	if (response.ok) {
		const responseContent = await response.json();
		return responseContent as T;
	} else {
		console.error(`Error encountered: ${response.statusText}`);
		return false;
	}
}

/**
 * Generates the backend url for the specified function with the specified query parameters.
 * @arg functionName - Name of the backend function to query. Must be non-empty,
 * and must correspond to a valid backend function.
 * @arg queryParameters - Query parameters to be sent to the backend
 */
export function generateFunctionUrl(
	functionName: string,
	queryParameters?: QueryParameter[],
): string {
	let queryParameterString = '';
	if (queryParameters && queryParameters.length > 0) {
		let firstParameterSet = false;
		for (const parameter of queryParameters) {
			const encodedName = encodeURIComponent(parameter.name);
			const encodedValue = encodeURIComponent(parameter.value);
			const delimiter = firstParameterSet ? '&' : '?';
			queryParameterString += `${delimiter}${encodedName}=${encodedValue}`;
			firstParameterSet = true;
		}
	}

	return `${urlBase}${functionName}${queryParameterString}`;
}
