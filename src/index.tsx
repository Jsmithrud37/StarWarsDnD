import { Auth0Provider } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Load environment variables from git-ignored file for local debugging.
// The values will be loaded into the environment already in production.
if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const config = require('./debug-environment.json');
	process.env.AUTH_DOMAIN = config.AUTH_DOMAIN;
	process.env.AUTH_CLIENT_ID = config.AUTH_CLIENT_ID;
}

ReactDOM.render(
	<Auth0Provider
		domain="datapad.us.auth0.com"
		clientId="U0kkfC5BuX8bn9b0TEAh6DOWclZmYyv4"
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

// /**
//  * Gets required auth values from the environment if set (production),
//  * otherwise gets them from local debug environment config (debug).
//  */
// function getAuthValues(): { domain: string; clientId: string } {
// 	if (!process.env.AUTH_DOMAIN || !process.env.AUTH_CLIENT_ID) {
// 		const debugEnv = Fs.readFileSync('debug_environment.json', 'utf8');
// 		const json = JSON.parse(debugEnv);
// 		return {
// 			domain: json.AUTH_DOMAIN,
// 			clientId: json.AUTH_CLIENT_ID,
// 		};
// 	}
// 	return {
// 		domain: process.env.AUTH_DOMAIN,
// 		clientId: process.env.AUTH_CLIENT_ID,
// 	};
// }
