import * as Fs from 'fs-extra';

/**
 * For local use only. Extract url with auth credentials from git-ignored file.
 */
export function localDbUrl(): string {
	const json = Fs.readJSONSync('../debug-environment.json');
	return json.DB_URL;
}
