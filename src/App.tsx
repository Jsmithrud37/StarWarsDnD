import { withAuth0, WithAuth0Props } from '@auth0/auth0-react';
import { Button } from '@material-ui/core';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Datapad, { reducers } from './apps/Datapad';
import { MuiThemeProvider } from '@material-ui/core';
import { appTheme } from './Theming';
import LoadingScreen from './shared-components/LoadingScreen';

const dataStore = createStore(reducers);

const profileEnabled = true;
const galaxyMapEnabled = true;
const shopsEnabled = true;
const contactsEnabled = true;
const messengerEnabled = true;
const timelineEnabled = true;

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
							profileEnabled={profileEnabled}
							galaxyMapEnabled={galaxyMapEnabled}
							shopsEnabled={shopsEnabled}
							contactsEnabled={contactsEnabled}
							messengerEnabled={messengerEnabled}
							timelineEnabled={timelineEnabled}
						/>
					</MuiThemeProvider>
				</Provider>
			);
		}

		this.props.auth0.loginWithRedirect();

		return <LoadingScreen text="Please sign in to continue..." />;
	}
}

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

const App = withAuth0(AppComponent);

export default App;
