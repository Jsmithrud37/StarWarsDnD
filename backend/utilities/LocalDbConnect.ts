import * as debugConfig from '../debug-environment.json';

/**
 * For local use only. Extract url with auth credentials from git-ignored file.
 */
export function localDbUrl(): string {
	return debugConfig.DB_URL;
}
