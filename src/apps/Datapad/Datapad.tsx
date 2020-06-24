import React, { ReactNode } from 'react';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { slide as BurgerMenu, State as BurgerMenuState } from 'react-burger-menu';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import {
	AccordionMenu,
	AccordionMenuItemStyle,
	SimpleAccordionMenuItemBuilder,
} from '../../shared-components/AccordionMenu';
import { Contacts } from '../Contacts';
import GalaxyMap from '../GalaxyMap';
import Messenger from '../Messenger';
import Shop, { reducers as shopReducers } from '../Shop';
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
	borderColor: undefined,
};

/**
 * Menu item style used for selected items.
 */
const menuItemStyleSelected: AccordionMenuItemStyle = {
	backgroundColor: 'primary',
	textColor: 'light',
	borderColor: 'primary',
};

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Datapad {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

/**
 * Datapad Component state. Not managed by Redux.
 */
interface State {
	/**
	 * Width of the viewport. Used to position items.
	 */
	viewPortWidthInPixels: number;
}

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
class DatapadComponent extends React.Component<Props, State> {
	/**
	 * Redux data store for the shops app.
	 */
	private readonly shopStore: never;

	public constructor(props: Props) {
		super(props);
		this.state = {
			viewPortWidthInPixels: window.innerWidth,
		};
		this.shopStore = createStore(shopReducers);
	}

	private setViewPortWidth(width: number): void {
		this.setState({
			...this.state,
			viewPortWidthInPixels: width,
		});
	}

	public render(): ReactNode {
		window.addEventListener('resize', () => {
			this.setViewPortWidth(window.innerWidth);
		});

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
			<BurgerMenu
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
						top: '61px',
					}}
				/>
			</BurgerMenu>
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
				return <Contacts />;
			case AppId.Shops:
				return (
					<Provider store={this.shopStore}>
						<Shop />
					</Provider>
				);

			case AppId.Messenger:
				return <Messenger />;
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
			<BurgerMenu
				id={menuId}
				className="Datapad-app-menu"
				menuClassName="Datapad-app-menu-expanded"
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
					initialSelectionIndex={this.props.appSelection}
					onSelectionChange={(appSelection: AppId) => this.props.changeApp(appSelection)}
					defaultItemStyle={menuItemStyleDefault}
					selectedItemStyle={menuItemStyleSelected}
					menuItemBuilders={[
						// TODO: update builders to take AppId and return it in onClick
						new SimpleAccordionMenuItemBuilder('Galaxy Map'),
						new SimpleAccordionMenuItemBuilder('Shops'),
						new SimpleAccordionMenuItemBuilder('Contacts'),
						new SimpleAccordionMenuItemBuilder('Messenger'),
					]}
				/>
			</BurgerMenu>
		);
	}
}

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): Parameters {
	return {
		appSelection: state.appSelection,
		isMenuCollapsed: state.isMenuCollapsed,
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
