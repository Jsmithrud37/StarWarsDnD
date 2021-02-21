import { render } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { changeApp, collapseMenu, expandMenu, setPlayer } from '../../Actions';
import AppId from '../../AppId';
import { DatapadMenu } from '../Menu';
import { Player, PlayerKind } from '../../Player';

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
function mockAppSelectionChange(newSelection: AppId): void {
	console.log(`Changed app selection to '${newSelection}'.`);
}

/**
 * Mocks the logout functionality supported by the Datapad
 */
function mockLogout(): void {
	console.log('User logged out.');
}

/**
 * Mocks the menu collapse functionality
 */
function mockMenuCollapse(): void {
	console.log('Menu collapsed.');
}

/**
 * Renders the datapad app, initialized with its required Redux datastore.
 */
function renderApp(): ReactNode {
	return (
		<DatapadMenu
			player={player}
			appSelection={initialAppSelection}
			onAppSelectionChange={mockAppSelectionChange}
			onMenuCollapse={mockMenuCollapse}
			logoutFunction={mockLogout}
		/>
	);
}

// TODO: better tests than text only
test('Menu contains expected buttons', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const expectedTextElement = [/Profile/, /Galaxy Map/, /Shops/, /Contacts/, /Timeline/];

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

test('Menu contains SW5e link', () => {
	const { getByText } = render(<>{renderApp()}</>);

	const element = getByText(`Roll20`);
	expect(element).toBeInTheDocument();
	expect(element).toHaveAttribute('href');
});
