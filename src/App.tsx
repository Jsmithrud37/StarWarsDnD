import { withAuth0, WithAuth0Props } from '@auth0/auth0-react';
import { Button, Modal } from '@material-ui/core';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Datapad, { reducers } from './apps/Datapad';
import { MuiThemeProvider } from '@material-ui/core';
import { appTheme } from './Theming';
import LoadingScreen from './shared-components/LoadingScreen';

const dataStore = createStore(reducers);

const galaxyMapEnabled = true;
const shopsEnabled = true;
const contactsEnabled = true;
const messengerEnabled = true;
const timelineEnabled = process.env.NODE_ENV !== 'production';

class AppComponent extends React.Component<WithAuth0Props> {
	public constructor(props: WithAuth0Props) {
		super(props);
	}

	public render(): React.ReactNode {
		if (this.props.auth0.isLoading) {
			return this.renderLoading();
		} else if (!this.props.auth0.isAuthenticated) {
			return this.renderLogin();
		} else {
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
	}

	private renderLoading(): React.ReactNode {
		return (
			<Modal
				open={true}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						color: 'white',
						padding: '10px',
					}}
				>
					<div>
						<LoadingScreen text="Loading..." />
					</div>
				</div>
			</Modal>
		);
	}

	private renderLogin(): React.ReactNode {
		const body = this.props.auth0.error
			? renderLoginError(
					this.props.auth0.error,
					this.props.auth0.loginWithRedirect,
					this.props.auth0.logout,
			  )
			: renderLoginPrompt(this.props.auth0.loginWithRedirect);

		return (
			<Modal
				open={true}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						backgroundColor: 'rgba(100, 0, 0, 0.7)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '30px',
						color: 'white',
					}}
				>
					{body}
				</div>
			</Modal>
		);
	}
}

/**
 * Renders a dialogue prompting the user to login.
 * @param loginFunction - Function to be invoked to attempt a new login.
 */
function renderLoginPrompt(loginFunction: () => void): React.ReactNode {
	return (
		<>
			<h4>Please sign in to continue...</h4>
			<br />
			<Button variant="contained" onClick={() => loginFunction()}>
				Login
			</Button>
		</>
	);
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
