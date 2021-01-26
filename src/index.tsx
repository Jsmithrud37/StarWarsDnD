import { Auth0Provider } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { background1 } from './Theming';

ReactDOM.render(
	<div
		style={{
			width: '100%',
			height: '100vh',
			backgroundColor: background1,
			color: 'white',
		}}
	>
		<Auth0Provider
			domain="datapad.us.auth0.com"
			clientId="U0kkfC5BuX8bn9b0TEAh6DOWclZmYyv4"
			redirectUri={window.location.origin}
		>
			<App />
		</Auth0Provider>
	</div>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
