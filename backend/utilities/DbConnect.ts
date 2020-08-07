import { Connection, ConnectionOptions, createConnection } from 'mongoose';
import { localDbUrl } from './LocalDbConnect';

/**
 * Performs the provided action with a database connection.
 */
export async function withDbConnection<T>(
	databaseName: string,
	action: (db: Connection) => Promise<T>,
): Promise<T> {
	console.log('Attempting to connect to database...');

	const dbUrl = getDbUrl(databaseName);

	const connectionOptions: ConnectionOptions = {
		// bufferMaxEntries: 0,
		// reconnectTries: 5000,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	const connection = await createConnection(`${dbUrl}`, connectionOptions);
	try {
		console.log('Connected.');
		const result = await action(connection);
		return result;
	} finally {
		console.log('Closing database connection.');
		await connection.close();
	}
}

/**
 * Gets the Db connect url. If it is set as an environment variable, uses that.
 * Otherwise assumes local debugging and will read from local config file.
 */
function getDbUrl(databaseName: string): string {
	let urlBase;
	if (process.env.DB_URL) {
		urlBase = process.env.DB_URL;
	} else {
		urlBase = localDbUrl();
	}

	return `${urlBase}${databaseName}?retryWrites=true&w=majority`;
}
