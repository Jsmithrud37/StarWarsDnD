import * as Fs from 'fs-extra';
import * as Path from 'path';

/**
 * For local use only. Extract url with auth credentials from git-ignored file.
 */
export function localDbUrl(): string {
	const json = Fs.readJSONSync(Path.resolve('backend-debug-environment.json'));
	return json.DB_URL;
}
