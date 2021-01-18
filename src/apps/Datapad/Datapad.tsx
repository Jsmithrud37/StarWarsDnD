import { Button } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import ContactsApp, { reducers as contactsReducers } from '../Contacts';
import GalaxyMap from '../GalaxyMap';
import Messenger from '../Messenger';
import ShopsApp, { reducers as shopReducers } from '../Shop';
import Timeline from '../Timeline';
import { Actions, changeApp, collapseMenu, expandMenu, setPlayer } from './Actions';
import AppId from './AppId';
import { AppState } from './State';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Drawer,
	Divider,
	IconButton,
	Paper,
} from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import TimelineIcon from '@material-ui/icons/Timeline';
import MessageIcon from '@material-ui/icons/Message';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { background1 } from '../../Theming';
import { Player, PlayerKind } from './Player';
import { executeBackendFunction } from '../../utilities/NetlifyUtilities';
import LoadingScreen from '../../shared-components/LoadingScreen';

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

	/**
	 * Galaxy Map app will be enabled iff true or undefined.
	 */
	galaxyMapEnabled?: boolean;

	/**
	 * Shops app will be enabled iff true or undefined.
	 */
	shopsEnabled?: boolean;

	/**
	 * Contacts app will be enabled iff true or undefined.
	 */
	contactsEnabled?: boolean;

	/**
	 * Messenger app will be enabled iff true or undefined.
	 */
	messengerEnabled?: boolean;

	/**
	 * Timeline app will be enabled iff true or undefined.
	 */
	timelineEnabled?: boolean;
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
 * Private Datapad Component state. Not managed by Redux.
 */
interface PrivateState {
	/**
	 * Width of the viewport. Used to position items.
	 */
	viewPortWidthInPixels: number;
}

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
export class DatapadComponent extends React.Component<Props, PrivateState> {
	/**
	 * Redux data store for the Shop app.
	 */
	private readonly shopStore: never;

	/**
	 * Redux data store for the Contacts app.
	 */
	private readonly contactsStore: never;

	public constructor(props: Props) {
		super(props);
		this.state = {
			viewPortWidthInPixels: window.innerWidth,
		};
		this.shopStore = createStore(shopReducers);
		this.contactsStore = createStore(contactsReducers);
	}

	private updateViewPortWidth(): void {
		this.setState({
			...this.state,
			viewPortWidthInPixels: window.innerWidth,
		});
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
					// backgroundColor: '#3b414d',
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
	 * {@inheritdoc React.Component.componentDidMount}
	 */
	public componentDidMount(): void {
		window.addEventListener('resize', this.updateViewPortWidth.bind(this));
	}

	/**
	 * {@inheritdoc React.Component.componentWillUnmount}
	 */
	public componentWillUnmount(): void {
		window.removeEventListener('resize', this.updateViewPortWidth.bind(this));
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
			case AppId.Messenger:
				return <Messenger />;
			case AppId.Timeline:
				return <Timeline />;
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
		return (
			<Drawer
				id={menuId}
				onClose={() => {
					this.props.collapseMenu();
				}}
				open={!this.props.isMenuCollapsed}
			>
				<List
					component="nav"
					disablePadding={true}
					style={{
						width: `225px`,
						height: '100%',
						backgroundColor: background1,
					}}
				>
					{this.renderWelcome()}
					{this.renderUserRole()}
					{this.renderCharacters()}
					<Divider orientation="horizontal" />
					<Divider orientation="horizontal" />
					<Divider orientation="horizontal" />
					{this.renderAppsList()}
					<Divider orientation="horizontal" />
					<Divider orientation="horizontal" />
					<Divider orientation="horizontal" />
					{this.renderMenuMisc()}
					<Divider orientation="horizontal" />
					<Divider orientation="horizontal" />
					<Divider orientation="horizontal" />
					{this.renderMenuFooter()}
				</List>
			</Drawer>
		);
	}

	private renderWelcome(): React.ReactNode {
		const userName: string = this.props.userName;

		return (
			<ListItem>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'space-around',
					}}
				>
					<div style={this.menuTextContainerStyle}>
						<h5>{`Welcome ${userName}!`}</h5>
					</div>
					<div>
						<IconButton onClick={() => this.props.collapseMenu()}>
							<CloseIcon />
						</IconButton>
					</div>
				</div>
			</ListItem>
		);
	}

	private renderUserRole(): React.ReactNode {
		const player = this.props.signedInPlayer;

		if (!player) {
			throw new Error('No player set. Cannot render datapad menu.');
		}

		return (
			<div style={this.menuTextContainerStyle}>
				<h6>
					<b>Role: </b>
					{player.playerKind}
				</h6>
			</div>
		);
	}

	private renderCharacters(): React.ReactNode {
		const player = this.props.signedInPlayer;

		if (!player) {
			throw new Error('No player set. Cannot render datapad menu.');
		}

		const userIsDungeonMaster = player.playerKind === PlayerKind.DungeonMaster;

		const playerCharactersListRender = (
			<ul>
				<li>
					{userIsDungeonMaster ? (
						<b>all</b>
					) : (
						player.characters?.map((character) => {
							return <li key={character}>{character}</li>;
						})
					)}
				</li>
			</ul>
		);

		return (
			<div style={this.menuTextContainerStyle}>
				<h6>
					<b>Characters:</b>
				</h6>
				{playerCharactersListRender}
			</div>
		);
	}

	private renderAppsList(): React.ReactNode {
		return (
			<div>
				<div style={this.menuTextContainerStyle}>
					<h5>Applications:</h5>
				</div>
				{/* TODO: user details */}
				{/* <Divider orientation="horizontal"></Divider> */}
				{this.createMenuItem(
					'Galaxy Map',
					<MapIcon />,
					AppId.GalaxyMap,
					this.props.galaxyMapEnabled ?? true,
				)}
				{this.createMenuItem(
					'Shops',
					<ShoppingCartIcon />,
					AppId.Shops,
					this.props.shopsEnabled ?? true,
				)}
				{this.createMenuItem(
					'Contacts',
					<PeopleIcon />,
					AppId.Contacts,
					this.props.contactsEnabled ?? true,
				)}
				{this.createMenuItem(
					'Timeline',
					<TimelineIcon />,
					AppId.Timeline,
					this.props.timelineEnabled ?? true,
				)}
				{this.createMenuItem(
					'Messenger',
					<MessageIcon />,
					AppId.Messenger,
					this.props.messengerEnabled ?? true,
				)}
			</div>
		);
	}

	private renderMenuMisc(): React.ReactNode {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					float: 'inline-end',
					padding: '10px',
				}}
			>
				<h5>Other Resources</h5>
				<ListItem>
					<a href="https://sw5e.com/" target="_blank" rel="noopener noreferrer">
						SW5e
					</a>
				</ListItem>
				<ListItem>
					<a
						href="https://drive.google.com/drive/folders/0B0DnV-NrBZTZbHNZb0QzNXRNdE0?usp=sharing"
						target="_blank"
						rel="noopener noreferrer"
					>
						Drive
					</a>
				</ListItem>
			</div>
		);
	}

	private renderMenuFooter(): React.ReactNode {
		return (
			<ListItem>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'start',
						padding: '10px',
					}}
				>
					<Button variant="contained" onClick={() => this.props.logoutFunction()}>
						Log Out
					</Button>
				</div>
			</ListItem>
		);
	}

	private createMenuItem(
		text: string,
		icon: React.ReactElement,
		appId: AppId,
		enabled: boolean,
	): React.ReactNode {
		return (
			<ListItem
				button
				selected={appId === this.props.appSelection}
				onClick={() => this.props.changeApp(appId)}
				key={appId}
				disabled={!enabled}
			>
				<ListItemIcon>{icon}</ListItemIcon>
				<ListItemText primary={text} />
			</ListItem>
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
