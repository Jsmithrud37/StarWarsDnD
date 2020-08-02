import { render } from '@testing-library/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Datapad from '../Datapad';
import { reducer as datapadReducer } from '../State';

const dataStore = createStore(datapadReducer);

const userName = 'test-user';

/**
 * Mocks the logout functionality supported by the Datapad
 */
function mockLogout(): void {
	console.log('User logged out.');
}

/**
 * Renders the datapad app, initialized with its required Redux datastore.
 */
function renderApp(): ReactNode {
	return (
		<Provider store={dataStore}>
			<Datapad userName={userName} logoutFunction={mockLogout} />
		</Provider>
	);
}

// TODO: better tests than text only
test('Menu contains expected buttons', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const expectedTextElement = [/Galaxy Map/, /Shops/, /Contacts/, /Messenger/, /Timeline/];

	for (const query of expectedTextElement) {
		const element = getByText(query);
		expect(element).toBeInTheDocument();
	}
});
