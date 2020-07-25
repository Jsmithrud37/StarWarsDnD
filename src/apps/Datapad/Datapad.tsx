import React, { ReactNode } from 'react';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { push as PushMenu, slide as SlideMenu, State as BurgerMenuState } from 'react-burger-menu';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import {
	AccordionMenu,
	AccordionMenuItemBuilder,
	AccordionMenuItemStyle,
	SimpleAccordionMenuItemBuilder,
} from '../../shared-components/AccordionMenu';
import { DisabledAccordionMenuItemBuilder } from '../../shared-components/AccordionMenu/DisabledAccordionMenuItem';
import Contacts, { reducers as contactsReducers } from '../Contacts';
import GalaxyMap from '../GalaxyMap';
import Messenger from '../Messenger';
import Shop, { reducers as shopReducers } from '../Shop';
import Timeline from '../Timeline';
import { Actions, changeApp, collapseMenu, expandMenu } from './Actions';
import AppId from './AppId';
import { AppState } from './State';
import './Styling/Datapad.css';

const appId = 'datpad';
const viewId = 'datapad-view';
const menuId = 'datapad-menu';

const menuWidthInPixels = 225;

/**
 * Menu item style used for items which are not currently selected.
 */
const menuItemStyleDefault: AccordionMenuItemStyle = {
	backgroundColor: 'dark',
	textColor: 'light',
	borderColor: 'dark',
};

/**
 * Menu item style used for selected items.
 */
const menuItemStyleSelected: AccordionMenuItemStyle = {
	backgroundColor: 'primary',
	textColor: 'light',
	borderColor: 'light',
};

/**
 * Menu item style used for selected items.
 */
const menuItemStyleDisabled: AccordionMenuItemStyle = {
	backgroundColor: 'secondary',
	textColor: 'light',
	borderColor: 'dark',
};

/**
 * Determines which apps in the Datapad are enabled. Set by the consumer.
 */
interface EnabledApps {
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
type Parameters = AppState & EnabledApps;

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
class DatapadComponent extends React.Component<Props, PrivateState> {
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

	public render(): ReactNode {
		const appView: ReactNode = (
			<div className="Datapad-view" id={viewId}>
				{this.renderApp()}
			</div>
		);
		const menu = this.renderMenu();
		return (
			<div className="App">
				{this.renderHeader()}
				<div className="Datapad" id={appId}>
					{menu}
					{appView}
				</div>
			</div>
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
			<header className="App-header">
				{this.renderMenuBurgerButton()}
				<img
					className="App-header-logo"
					src="images/Order-Of-The-Fallen-Logo-Long.png"
					alt="Campaign logo"
				/>
			</header>
		);
	}

	/**
	 * Renders the burger menu button that controls revealing and hiding the side menu,
	 * which lives in the header above the menu.
	 */
	private renderMenuBurgerButton(): ReactNode {
		const buttonWidthInPixels = 25;
		const sliderWidthInPixels =
			Math.min(menuWidthInPixels, this.state.viewPortWidthInPixels / 4.3) -
			1.75 * buttonWidthInPixels;

		return (
			<SlideMenu
				width={`${sliderWidthInPixels}px`}
				onStateChange={(state) => {
					this.onMenuStateChange(state);
				}}
				isOpen={!this.props.isMenuCollapsed}
				disableOverlayClick={true}
				noOverlay={true}
				customBurgerIcon={false}
				customCrossIcon={false}
			>
				<HamburgerSqueeze
					className="App-header-burger-button"
					barColor="white"
					buttonWidth={`${buttonWidthInPixels}`}
					isActive={!this.props.isMenuCollapsed}
					toggleButton={
						this.props.isMenuCollapsed
							? () => this.props.expandMenu()
							: () => this.props.collapseMenu()
					}
					buttonStyle={{
						left: `${sliderWidthInPixels}px`,
						top: '60px',
					}}
				/>
			</SlideMenu>
		);
	}

	/**
	 * Renders the application view
	 */
	private renderApp(): ReactNode {
		const selection = this.props.appSelection;
		switch (selection) {
			case AppId.GalaxyMap:
				return <GalaxyMap />;
			case AppId.Contacts:
				return (
					<Provider store={this.contactsStore}>
						<Contacts />
					</Provider>
				);
			case AppId.Shops:
				return (
					<Provider store={this.shopStore}>
						<Shop />
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

	/**
	 * Function to be invoked by state-change on BurgerMenu implementation of Datapad menu.
	 */
	private onMenuStateChange(menuState: BurgerMenuState): void {
		if (menuState.isOpen) {
			this.props.expandMenu();
		} else {
			this.props.collapseMenu();
		}
	}

	/**
	 * Renders the Datapad main menu
	 */
	private renderMenu(): ReactNode {
		return (
			<PushMenu
				id={menuId}
				pageWrapId={viewId}
				outerContainerId={appId}
				width={`${menuWidthInPixels}px`}
				onStateChange={(state) => {
					this.onMenuStateChange(state);
				}}
				isOpen={!this.props.isMenuCollapsed}
				disableOverlayClick={this.props.isMenuCollapsed}
				noOverlay={this.props.isMenuCollapsed}
				customBurgerIcon={false}
				customCrossIcon={false}
			>
				<AccordionMenu
					className="Datapad-app-menu"
					initialSelectionIndex={this.props.appSelection}
					onSelectionChange={(appSelection: AppId) => this.props.changeApp(appSelection)}
					defaultItemStyle={menuItemStyleDefault}
					selectedItemStyle={menuItemStyleSelected}
					menuItemBuilders={[
						// TODO: update builders to take AppId and return it in onClick
						createMenuItemBuilder('Galaxy Map', this.props.galaxyMapEnabled ?? true),
						createMenuItemBuilder('Shops', this.props.shopsEnabled ?? true),
						createMenuItemBuilder('Contacts', this.props.contactsEnabled ?? true),
						createMenuItemBuilder('Messenger', this.props.messengerEnabled ?? true),
						createMenuItemBuilder('Timeline', this.props.timelineEnabled ?? true),
					]}
				/>
			</PushMenu>
		);
	}
}

/**
 * Creates the appropriate form of menu item builder based on whether or not the app is enabled.
 */
function createMenuItemBuilder(label: string, appEnabled: boolean): AccordionMenuItemBuilder {
	const menuItemClassName = 'Datapad-menu-item';
	return appEnabled
		? new SimpleAccordionMenuItemBuilder(
				label,
				menuItemStyleDefault,
				menuItemStyleSelected,
				menuItemClassName,
		  )
		: new DisabledAccordionMenuItemBuilder(
				label,
				menuItemStyleDisabled,
				'Coming Soon',
				menuItemClassName,
		  );
}

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState, externalProps: EnabledApps): Parameters {
	return {
		appSelection: state.appSelection,
		isMenuCollapsed: state.isMenuCollapsed,
		galaxyMapEnabled: externalProps.galaxyMapEnabled,
		shopsEnabled: externalProps.shopsEnabled,
		contactsEnabled: externalProps.contactsEnabled,
		messengerEnabled: externalProps.messengerEnabled,
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
})(DatapadComponent);

export default Datapad;
