import { Auth0Provider } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Load environment variables from git-ignored file for local debugging.
// The values will be loaded into the environment already in production.
let authZeroDomain, authZeroClientId: string;
if (process.env.NODE_ENV === 'production') {
	if (!process.env.AUTH_DOMAIN || !process.env.AUTH_CLIENT_ID) {
		throw new Error('Missing environment variable.');
	}
	authZeroDomain = process.env.AUTH_DOMAIN;
	authZeroClientId = process.env.AUTH_CLIENT_ID;
} else {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const config = require('./debug-environment.json');
	authZeroDomain = config.AUTH_DOMAIN;
	authZeroClientId = config.AUTH_CLIENT_ID;
}

ReactDOM.render(
	<Auth0Provider
		domain={authZeroDomain}
		clientId={authZeroClientId}
		redirectUri={window.location.origin}
	>
		<App />
	</Auth0Provider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
