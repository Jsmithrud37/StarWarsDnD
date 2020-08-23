import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Actions, changeShop } from './Actions';
import { Cell, Inventory, InventoryHeader, InventoryItem } from './InventoryItem';
import { getApothicaryInventoryTEMP } from './InventoryTemp/ApothicaryInventoryTemp';
import { getEquipmentInventoryTEMP } from './InventoryTemp/EquipmentInventoryTemp';
import { ShopId } from './ShopId';
import { AppState } from './State';
import {
	Tabs,
	Tab,
	TableRow,
	TableHead,
	TableCell,
	Table,
	Card,
	CardContent,
} from '@material-ui/core';

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Shop {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

/**
 *Shop main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
class ShopComponent extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render(): ReactNode {
		return (
			<div className="Shops">
				{this.renderMenu()}
				{this.renderApp()}
			</div>
		);
	}

	/**
	 * Render the shop-selection menu
	 */
	public renderMenu(): ReactNode {
		return (
			<Tabs
				orientation="horizontal"
				value={this.props.shopSelection}
				id="shops-menu"
				onChange={(event, newSelection) => this.props.changeShop(newSelection as ShopId)}
			>
				{Object.values(ShopId).map((shop) => (
					<Tab value={shop} label={shop} key={shop} />
				))}
			</Tabs>
		);
	}

	public renderApp(): ReactNode {
		return <div className="Shops-body">{this.renderInventory()}</div>;
	}

	private getInventory(): Inventory {
		switch (this.props.shopSelection) {
			case ShopId.Equipment:
				return getEquipmentInventoryTEMP();
			case ShopId.Apothicary:
				return getApothicaryInventoryTEMP();
			default:
				throw new Error(`Unrecognized ShopId value: ${this.props.shopSelection}`);
		}
	}

	/**
	 * Renders the inventory view for the indicated shop
	 */
	public renderInventory(): ReactNode {
		const inventory: Inventory = this.getInventory();
		return renderInventory(inventory);
	}
}

/**
 * Renders the full inventory table.
 */
function renderInventory(inventory: Inventory): ReactNode {
	return (
		<Table>
			{renderHeader(inventory.header)}
			{renderInventoryData(inventory.data)}
		</Table>
	);
}

/**
 * Renders the inventory header.
 */
function renderHeader(header: InventoryHeader): ReactNode {
	return (
		<TableHead>
			<TableRow>
				<TableCell>Name</TableCell>
				{header.map((cell) => {
					return <TableCell key={cell.toString()}>{renderCell(cell, true)}</TableCell>;
				})}
				<TableCell>
					Cost (
					<a
						href="https://sw5e.com/rules/phb/equipment#currency"
						target="_blank"
						rel="noopener noreferrer"
					>
						cr
					</a>
					)
				</TableCell>
				<TableCell>Stock</TableCell>
			</TableRow>
		</TableHead>
	);
}

/**
 * Renders the table body.
 */
function renderInventoryData(data: InventoryItem[]): ReactNode {
	return (
		<tbody>
			{data.map((row) => {
				return <>{renderRow(row)}</>;
			})}
		</tbody>
	);
}

/**
 * Renders a data row
 */
function renderRow(row: InventoryItem): ReactNode {
	return (
		<TableRow>
			<TableCell>{row.name}</TableCell>
			{row.otherData.map((cell) => {
				return (
					<React.Fragment key={getCellText(cell)}>
						{renderCell(cell, false)}
					</React.Fragment>
				);
			})}
			<TableCell>{row.cost}</TableCell>
			<TableCell>{row.stock}</TableCell>
		</TableRow>
	);
}

/**
 * Renders an individual cell.
 */
function renderCell(cell: Cell | string, isHeaderCell: boolean): ReactNode {
	if (typeof cell === 'string') {
		return isHeaderCell ? <TableHead>{cell}</TableHead> : <TableCell>{cell}</TableCell>;
	} else {
		let render = <>{cell.text}</>;

		if (cell.link) {
			render = (
				<a href={cell.link} target="_blank" rel="noopener noreferrer">
					text
				</a>
			);
		}

		if (cell.popOverText) {
			// TODO: pop-over support
		}

		return isHeaderCell ? <TableHead>{render}</TableHead> : <TableCell>{render}</TableCell>;
	}
}

/**
 * Gets the text from a cell.
 */
function getCellText(cell: Cell | string): string {
	if (typeof cell === 'string') {
		return cell;
	} else {
		return cell.text;
	}
}

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): Parameters {
	return state;
}

/**
 * Shop app.
 * Displays shop inventories.
 */
const Shop = connect(mapStateToProps, {
	changeShop,
})(ShopComponent);

export default Shop;
