const urlBase = '/.netlify/functions/';

/**
 * Runs the specified backend query function.
 * @arg functionName - Name of the backend function to query. Must be non-empty,
 * and must correspond to a valid backend function.
 */
export async function fetchFromBackendFunction(functionName: string): Promise<any> {
	if (functionName.length === 0) {
		throw new Error('Cannot process empty query function.');
	}

	const functionUrl = `${urlBase}${functionName}`;
	const response = await fetch(functionUrl);
	const responseContent = await response.json();
	return responseContent;
}
