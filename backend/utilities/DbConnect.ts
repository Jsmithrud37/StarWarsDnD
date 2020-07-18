import { Connection, ConnectionOptions, createConnection } from 'mongoose';

const DB_URL = process.env.DB_URL;

/**
 * TODO
 * @arg action - Action to perform with the database context
 */
export async function withDbConnection<T>(action: (db: Connection) => Promise<T>): Promise<T> {
	console.log('Attempting to connect to database...');
	const connectionOptions: ConnectionOptions = {
		// bufferMaxEntries: 0,
		// reconnectTries: 5000,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	const connection = await createConnection(`${DB_URL}`, connectionOptions);
	try {
		console.log('Connected.');
		const result = await action(connection);
		return result;
	} finally {
		console.log('Closing database connection.');
		await connection.close();
	}
}
