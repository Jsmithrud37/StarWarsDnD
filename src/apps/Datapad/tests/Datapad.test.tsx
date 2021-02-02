import { render } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { changeApp, collapseMenu, expandMenu, setPlayer } from '../Actions';
import AppId from '../AppId';
import { DatapadComponent } from '../Datapad';
import { Player, PlayerKind } from '../Player';

import 'bootstrap/dist/css/bootstrap.min.css';

const userName = 'test-user';
const character = 'test-character';
const player: Player = {
	userName,
	playerKind: PlayerKind.Player,
	characters: [character],
};

const initialAppSelection = AppId.GalaxyMap;

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
		<DatapadComponent
			userName={userName}
			logoutFunction={mockLogout}
			signedInPlayer={player}
			appSelection={initialAppSelection}
			isMenuCollapsed={false}
			changeApp={changeApp}
			collapseMenu={collapseMenu}
			expandMenu={expandMenu}
			setPlayer={setPlayer}
		/>
	);
}

// TODO: better tests than text only
test('Menu contains expected buttons', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const expectedTextElement = [
		/Profile/,
		/Galaxy Map/,
		/Shops/,
		/Contacts/,
		/Messenger/,
		/Timeline/,
	];

	for (const query of expectedTextElement) {
		const element = getByText(query);
		expect(element).toBeInTheDocument();
	}
});

test('Menu contains welcome for user', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const element = getByText(`Welcome ${userName}!`);
	expect(element).toBeInTheDocument();
});

test('Menu contains Google Drive link', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const element = getByText(`Drive`);
	expect(element).toBeInTheDocument();
	expect(element).toHaveAttribute('href');
});

test('Menu contains SW5e link', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const element = getByText(`SW5e`);
	expect(element).toBeInTheDocument();
	expect(element).toHaveAttribute('href', 'https://sw5e.com/');
});
