import React, { ReactNode } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import Datapad from '../Datapad';
import { datapadReducer } from '../State';

import 'bootstrap/dist/css/bootstrap.min.css';

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

test('renders learn react link', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const galaxyMapMenuItem = getByText(/Galaxy Map/);
	const shopsMenuItem = getByText(/Shops/);
	const contactsMenuItem = getByText(/Contacts/);

	expect(galaxyMapMenuItem).toBeInTheDocument();
	expect(shopsMenuItem).toBeInTheDocument();
	expect(contactsMenuItem).toBeInTheDocument();
});
