import React, { ReactNode } from 'react';
import { AppId } from './Utilities';
import { Menu } from './Menu';
import GalaxyMap from '../GalaxyMap/GalaxyMap';
import { Shop, ShopId } from '../Shop/Shop';

import './Datapad.css';

export interface AppState {
	appSelection: AppId;
	appArguments: unknown;
}

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
export class Datapad extends React.Component<{}, AppState, any> {
	public constructor(props: {}) {
		super(props);
		this.state = {
			appSelection: AppId.GalaxyMap,
			appArguments: undefined,
		};
	}

	private changeApp(
		appSelection: AppId,
		appArguments: unknown = undefined,
	): void {
		this.setState({
			appSelection,
			appArguments,
		});
	}

	public render() {
		return (
			<div className="Datapad">
				<Menu onSelectionChange={(a, b) => this.changeApp(a, b)} />
				<div className="Datapad-view">{this.renderApp()}</div>
			</div>
		);
	}

	private renderApp(): ReactNode {
		const selection = this.state.appSelection;
		switch (selection) {
			case AppId.GalaxyMap:
				return <GalaxyMap />;
			case AppId.Contacts:
				return <div>TODO: Contacts App</div>;
			case AppId.Shops:
				return <Shop shopId={this.state.appArguments as ShopId} />;
			default:
				throw new Error(`Unrecognized app selection: ${selection}`);
		}
	}
}
