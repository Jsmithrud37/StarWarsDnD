import { generateFunctionUrl, QueryParameter, urlBase } from '../NetlifyUtilities';

test('generateFunctionUrl - no parameters', () => {
	const functionName = 'function';

	const expected = `${urlBase}${functionName}`;
	const result = generateFunctionUrl(functionName);
	expect(result).toEqual(expected);
});

test('generateFunctionUrl - 1 parameter', () => {
	const functionName = 'function';
	const parameters: QueryParameter[] = [{ name: 'foo', value: 'bar' }];

	const expected = `${urlBase}${functionName}?foo=bar`;
	const result = generateFunctionUrl(functionName, parameters);
	expect(result).toEqual(expected);
});

test('generateFunctionUrl - multiple parameters', () => {
	const functionName = 'function';
	const parameters: QueryParameter[] = [
		{ name: 'foo', value: 'bar' },
		{ name: 'meaningOfLife', value: 42 },
		{ name: 'yes', value: false },
		{ name: 'stringWithSpaces', value: 'Here is a string with some spaces.' },
	];

	const expected = `${urlBase}${functionName}?foo=bar&meaningOfLife=42&yes=false&stringWithSpaces=Here%20is%20a%20string%20with%20some%20spaces.`;
	const result = generateFunctionUrl(functionName, parameters);
	expect(result).toEqual(expected);
});
