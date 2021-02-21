import React, { ReactNode } from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import ProfileApp, { reducers as profileReducers } from '../../Profile';
import ContactsApp, { reducers as contactsReducers } from '../../Contacts';
import GalaxyMap from '../../GalaxyMap';
import ShopsApp, { reducers as shopReducers } from '../../Shop';
import Timeline, { reducers as timelineReducers } from '../../Timeline';
import { Actions, changeApp, collapseMenu, expandMenu, setPlayer } from '../Actions';
import AppId from '../AppId';
import { AppState } from '../State';
import { Drawer, IconButton, Paper } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import { background1 } from '../../../Theming';
import { Player } from '../Player';
import { executeBackendFunction } from '../../../utilities/NetlifyUtilities';
import LoadingScreen from '../../../shared-components/LoadingScreen';
import {
	ViewPortAwareComponent,
	ViewPortAwareState,
} from '../../../shared-components/ViewPortAwareComponent';
import { DatapadMenu } from './Menu';

const appId = 'datpad';
const viewId = 'datapad-view';
const menuId = 'datapad-menu';

/**
 * Determines which apps in the Datapad are enabled. Set by the consumer.
 */
interface InputProps {
	/**
	 * Name of the signed-in user.
	 */
	userName: string;

	/**
	 * Function for signing the user out of the application.
	 */
	logoutFunction: () => void;
}

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState & InputProps;

/**
 * Datapad {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
export class DatapadComponent extends ViewPortAwareComponent<Props, ViewPortAwareState> {
	/**
	 * Redux data store for the Profile app.
	 */
	private readonly profileStore: never;

	/**
	 * Redux data store for the Shop app.
	 */
	private readonly shopStore: never;

	/**
	 * Redux data store for the Contacts app.
	 */
	private readonly contactsStore: never;

	/**
	 * Redux data store for the Timeline app.
	 */
	private readonly timelineStore: never;

	public constructor(props: Props) {
		super(props);
		this.state = {
			viewportWidthInPixels: window.innerWidth,
			viewportHeightInPixels: window.innerHeight,
		};
		this.profileStore = createStore(profileReducers);
		this.shopStore = createStore(shopReducers);
		this.contactsStore = createStore(contactsReducers);
		this.timelineStore = createStore(timelineReducers);
	}

	private async fetchPlayer(): Promise<void> {
		interface FetchPlayerResult {
			player: Player;
		}

		const getPlayerFunction = 'GetPlayer';
		const getPlayerParameters = [
			{
				name: 'userName',
				value: this.props.userName.toLocaleLowerCase(),
			},
		];
		const response = await executeBackendFunction<FetchPlayerResult>(
			getPlayerFunction,
			getPlayerParameters,
		);
		if (response) {
			// TODO: is this check needed?
			const player = response.player;
			this.props.setPlayer(player);
		} else {
			throw new Error(
				`Player associated with user "${this.props.userName}" not found. Talk to your DM 😉`,
			);
		}
	}

	public render(): ReactNode {
		if (!this.props.signedInPlayer) {
			// If we have not found the player data for
			this.fetchPlayer();
			return <LoadingScreen text={`Loading player data...`} />;
		}

		const appView: ReactNode = (
			<div
				id={viewId}
				style={{
					textAlign: 'center',
					float: 'right',
					flex: 1,
				}}
			>
				{this.renderApp()}
			</div>
		);

		const menu = this.renderMenu();

		return (
			<Paper
				color="paper"
				style={{
					display: 'flex',
					flexDirection: 'column',
					position: 'absolute',
					textAlign: 'center',
					width: '100%',
					height: '100%',
				}}
			>
				{this.renderHeader()}
				<div
					id={appId}
					style={{
						display: 'flex',
						flexDirection: 'row',
						textAlign: 'center',
						flex: 1,
						overflow: 'clip',
					}}
				>
					{appView}
					{menu}
				</div>
			</Paper>
		);
	}

	/**
	 * Renders the banner at the top of the app.
	 */
	private renderHeader(): ReactNode {
		return (
			<header
				className="App-header"
				style={{
					position: 'relative',
					backgroundColor: background1,
				}}
			>
				<IconButton
					onClick={() => this.props.expandMenu()}
					style={{
						position: 'absolute',
						left: '2px',
						bottom: '2px',
					}}
				>
					<MenuIcon />
				</IconButton>
				<img
					src="images/Order-Of-The-Fallen-Logo-Long.png"
					alt="Campaign logo"
					style={{
						height: '60px',
						marginTop: '15px',
						marginBottom: '15px',
						marginLeft: '5px',
						marginRight: '5px',
						pointerEvents: 'none',
						objectFit: 'scale-down',
					}}
				/>
			</header>
		);
	}

	/**
	 * Renders the application view
	 */
	private renderApp(): ReactNode {
		if (!this.props.signedInPlayer) {
			throw new Error("Player data has not been loaded yet. Can't render app without it.");
		}

		const selection = this.props.appSelection;
		switch (selection) {
			case AppId.Profile:
				return (
					<Provider store={this.profileStore}>
						<ProfileApp player={this.props.signedInPlayer} />
					</Provider>
				);
			case AppId.GalaxyMap:
				return <GalaxyMap />;
			case AppId.Contacts:
				return (
					<Provider store={this.contactsStore}>
						<ContactsApp player={this.props.signedInPlayer} />
					</Provider>
				);
			case AppId.Shops:
				return (
					<Provider store={this.shopStore}>
						<ShopsApp />
					</Provider>
				);
			case AppId.Timeline:
				return (
					<Provider store={this.timelineStore}>
						<Timeline />
					</Provider>
				);
			default:
				throw new Error(`Unrecognized app selection: ${selection}`);
		}
	}

	menuTextContainerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingLeft: '10px',
		paddingTop: '5px',
	};

	/**
	 * Renders the Datapad main menu
	 */
	private renderMenu(): ReactNode {
		const player = this.props.signedInPlayer;
		if (!player) {
			throw new Error(
				'Player data not loaded yet. Cannot render menu until data is available.',
			);
		}

		return (
			<Drawer
				id={menuId}
				onClose={() => {
					this.props.collapseMenu();
				}}
				open={!this.props.isMenuCollapsed}
			>
				<DatapadMenu
					player={player}
					appSelection={this.props.appSelection}
					onAppSelectionChange={(newSelection) => this.props.changeApp(newSelection)}
					onMenuCollapse={() => this.props.collapseMenu()}
					logoutFunction={() => this.props.logoutFunction()}
				/>
			</Drawer>
		);
	}
}

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState, externalProps: InputProps): Parameters {
	return {
		...state,
		...externalProps,
	};
}

/**
 * Datapad app.
 * Displays various sub-apps, and offers a menu for navigating them.
 */
const Datapad = connect(mapStateToProps, {
	changeApp,
	collapseMenu,
	expandMenu,
	setPlayer,
})(DatapadComponent);

export default Datapad;
