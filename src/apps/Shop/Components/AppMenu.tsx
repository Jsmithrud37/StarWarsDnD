import React from 'react';
import { AppBar, IconButton, Tab, Tabs } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { background4 } from '../../../Theming';
import { ShopId } from '../ShopId';

export interface AppMenuProps {
	currentShop: ShopId;
	changeShop: (newShopSelection: ShopId) => void;
	reloadInventory: () => void;
}

/**
 * Main menu for the Shops app
 */
export class AppMenu extends React.Component<AppMenuProps> {
	public constructor(props: AppMenuProps) {
		super(props);
	}

	public render(): React.ReactNode {
		return (
			<AppBar
				position="static"
				style={{
					backgroundColor: background4,
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<Tabs
					orientation="horizontal"
					value={this.props.currentShop}
					id="shops-menu"
					onChange={(event, newSelection) =>
						this.props.changeShop(newSelection as ShopId)
					}
				>
					{Object.values(ShopId).map((shop) => (
						<Tab value={shop} label={shop} key={shop} />
					))}
				</Tabs>
				<div style={{ paddingRight: '15px' }}>
					<IconButton color="primary" onClick={() => this.props.reloadInventory()}>
						<RefreshIcon color="primary" />
					</IconButton>
				</div>
			</AppBar>
		);
	}
}
