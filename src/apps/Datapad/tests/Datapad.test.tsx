import { render } from '@testing-library/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Datapad from '../Datapad';
import { datapadReducer } from '../State';

const dataStore = createStore(datapadReducer);

/**
 * Renders the datapad app, initialized with its required Redux datastore.
 */
function renderApp(): ReactNode {
	return (
		<Provider store={dataStore}>
			<Datapad />
		</Provider>
	);
}

// TODO: better tests than text only
test('Menu contains expected buttons', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const expectedTextElement = [/Galaxy Map/, /Shops/, /Contacts/, /Messenger/];

	for (const query of expectedTextElement) {
		const element = getByText(query);
		expect(element).toBeInTheDocument();
	}
});
