import React, { ReactNode } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import { connect } from 'react-redux';
import { fetchFromBackendFunction } from '../../utilities/NetlifyUtilities';
import { Actions, changeShop, loadInventory } from './Actions';
import { Cell, Inventory, InventoryHeader, InventoryItem } from './InventoryItem';
import { ShopId } from './ShopId';
import { AppState } from './State';

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

	/**
	 * {@inheritdoc React.Component.componentDidMount}
	 */
	public componentDidMount(): void {
		if (!this.props.inventory) {
			this.fetchInventory();
		}
	}

	private async fetchInventory(): Promise<void> {
		const getContactsFunction = 'GetShopInventory';
		const getContactsParameters = [
			{
				name: 'shopName',
				value: this.props.shopSelection.toLowerCase(), // TODO: find a way to not have to do this here
			},
		];
		const response = await fetchFromBackendFunction(getContactsFunction, getContactsParameters);
		const shopName = response.shopName;

		// If the shop selection has changed since we requested inventory from the server,
		// disregard the response.
		if (shopName === this.props.shopSelection.toLowerCase()) {
			const inventoryItems: InventoryItem[] = response.inventory;
			if (inventoryItems.length > 0) {
				const inventory = new Inventory([] /* TODO */, inventoryItems);
				this.props.loadInventory(inventory);
			}
		}
	}

	public render(): ReactNode {
		let view;
		if (!this.props.inventory) {
			this.fetchInventory();
			view = this.renderLoadingScreen();
		} else {
			view = this.renderApp();
		}

		return (
			<div className="Shops">
				{this.renderMenu()}
				{view}
			</div>
		);
	}

	// TODO: de-dup with Contacts.
	private renderLoadingScreen(): ReactNode {
		return (
			<>
				<div>Loading {this.props.shopSelection} inventory...</div>
				<Spinner animation="border" variant="light"></Spinner>
			</>
		);
	}

	/**
	 * Render the shop-selection menu
	 */
	public renderMenu(): ReactNode {
		return (
			<Tabs
				defaultActiveKey={this.props.shopSelection}
				id="shops-menu"
				onSelect={(shop: unknown) => this.props.changeShop(shop as ShopId)}
			>
				{Object.values(ShopId).map((shop) => (
					<Tab eventKey={shop} title={shop} key={shop} />
				))}
			</Tabs>
		);
	}

	public renderApp(): ReactNode {
		return (
			<Card bg="dark" text="light">
				<Card.Body className="Shops-body">{this.renderInventory()}</Card.Body>
			</Card>
		);
	}

	/**
	 * Renders the inventory view for the indicated shop
	 */
	public renderInventory(): ReactNode {
		if (!this.props.inventory) {
			throw new Error('Inventory not loaded.');
		}
		return renderInventory(this.props.inventory);
	}
}

/**
 * Renders the full inventory table.
 */
function renderInventory(inventory: Inventory): ReactNode {
	return (
		<Table bordered hover responsive striped variant="dark">
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
		<thead>
			<tr>
				<th>Name</th>
				<th>Type</th>
				<th>Weight (lb)</th>
				{/* TODO: handle custom table data */}
				<th>
					Cost (
					<a
						href="https://sw5e.com/rules/phb/equipment#currency"
						target="_blank"
						rel="noopener noreferrer"
					>
						cr
					</a>
					)
				</th>
				<th>Stock</th>
			</tr>
		</thead>
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
		<tr>
			<td>
				<a
					href={`https://sw5e.com/searchResults?searchText=${encodeURIComponent(
						row.name,
					)}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{row.name}
				</a>
			</td>
			<td>{row.type}</td>
			<td>{row.weight}</td>
			{/* TODO: handle custom table data */}
			<td>{row.cost}</td>
			<td>{row.stock}</td>
		</tr>
	);
}

/**
 * Renders an individual cell.
 */
function renderCell(cell: Cell | string, isHeaderCell: boolean): ReactNode {
	if (typeof cell === 'string') {
		return isHeaderCell ? <th>{cell}</th> : <td>{cell}</td>;
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

		return isHeaderCell ? <th>{render}</th> : <td>{render}</td>;
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
	loadInventory,
})(ShopComponent);

export default Shop;
