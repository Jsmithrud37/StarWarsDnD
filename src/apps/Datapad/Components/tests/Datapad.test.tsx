import { render } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { changeApp, collapseMenu, expandMenu, setPlayer } from '../../Actions';
import AppId from '../../AppId';
import { DatapadComponent } from '../Datapad';
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

test('Datapad smoke test', () => {
	render(<>{renderApp()}</>);
});
