import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Auth0Provider, withAuth0, WithAuth0Props } from '@auth0/auth0-react';
import { Button, MuiThemeProvider } from '@material-ui/core';

import Datapad, { reducers } from './apps/Datapad';
import { appTheme, background1 } from './Theming';
import LoadingScreen from './shared-components/LoadingScreen';
import * as serviceWorker from './serviceWorker';

import './index.css';

// TODO: some current styling depends on this. Should refactor to remove the need for it...
import 'bootstrap/dist/css/bootstrap.min.css';

const dataStore = createStore(reducers);

class AppComponent extends React.Component<WithAuth0Props> {
	public constructor(props: WithAuth0Props) {
		super(props);
	}

	public render(): React.ReactNode {
		if (this.props.auth0.isLoading) {
			return <LoadingScreen text="Authenticating..." />;
		}

		if (this.props.auth0.error) {
			return renderLoginError(
				this.props.auth0.error,
				this.props.auth0.loginWithRedirect,
				this.props.auth0.logout,
			);
		}

		if (this.props.auth0.isAuthenticated) {
			if (!this.props.auth0.user) {
				throw new Error('Authentication failed to provide user data.');
			}
			const userName = this.props.auth0.user.nickname;

			return (
				<Provider store={dataStore}>
					<MuiThemeProvider theme={appTheme}>
						<Datapad
							userName={userName}
							logoutFunction={() => this.props.auth0.logout()}
						/>
					</MuiThemeProvider>
				</Provider>
			);
		}

		this.props.auth0.loginWithRedirect();

		return <LoadingScreen text="Please sign in to continue..." />;
	}
}

const App = withAuth0(AppComponent);

/**
 * Renders an error message dialogue for failed login auth.
 * Offers the user the ability to retry, or to log out.
 * @param error - The error that was reported from the auth service.
 * @param loginFunction - Function to be invoked to attempt a new login.
 * @param logoutFunction - Function to be invoked to log out.
 */
function renderLoginError(
	error: Error,
	loginFunction: () => void,
	logoutFunction: () => void,
): React.ReactNode {
	return (
		<>
			<h4>There was a problem signing you in.</h4>
			<br />
			<p>{error.message}</p>
			<br />
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',
					width: '100%',
				}}
			>
				<Button variant="contained" onClick={() => loginFunction()}>
					Retry
				</Button>
				<Button variant="contained" onClick={() => logoutFunction()}>
					Log Out
				</Button>
			</div>
		</>
	);
}

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
