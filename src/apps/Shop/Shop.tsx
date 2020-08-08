import { Button, Modal } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import {
	DataEntry,
	NumberEntry,
	StringEntry,
} from '../../shared-components/EditItemForm/DataEntry';
import ItemEditForm from '../../shared-components/EditItemForm/EditItemForm';
import { fetchFromBackendFunction } from '../../utilities/NetlifyUtilities';
import { Actions, changeShop, loadInventory } from './Actions';
import { Inventory, InventoryItem } from './Inventory';
import { ShopId } from './ShopId';
import { AppState } from './State';

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Modal state local to the Shops app.
 */
interface ModalState {
	/**
	 * Indicates that the app is in the modal state of editing or adding an item.
	 */
	editing?: EditType;
}

/**
 * Shop {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

/**
 * Whether or not inventories may be edited.
 * TODO: permissions based on user roles.
 */
const canEdit = process.env.NODE_ENV !== 'production';

enum EditType {
	Insert,
	Edit,
}

/**
 *Shop main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
class ShopComponent extends React.Component<Props, ModalState> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			editing: undefined,
		};
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
			const inventory: Inventory = response.inventory;
			if (inventory.length > 0) {
				this.props.loadInventory(inventory);
			}
		}
	}

	private setIsEditing(value?: EditType): void {
		this.setState({ ...this.state, editing: value });
	}

	public render(): React.ReactNode {
		let view;
		if (!this.props.inventory) {
			this.fetchInventory();
			view = this.renderLoadingScreen();
		} else {
			view = this.renderApp();
		}

		// TODO: get as component input
		const formSchemas = new Map<string, DataEntry>([
			['name', new StringEntry('', 'Name', undefined, undefined)],
			['type', new StringEntry('', 'Type', undefined, undefined)],
			['weight', new NumberEntry(7, 'Weight(lb)', undefined, undefined, undefined, true)],
			['stock', new NumberEntry(7, 'Stock', undefined, undefined, undefined, true)],
		]);

		let modalTitle = '';
		if (this.state.editing !== undefined) {
			switch (this.state.editing) {
				case EditType.Edit:
					modalTitle = 'Edit item';
					break;
				case EditType.Insert:
					modalTitle = 'Insert new item';
					break;
				default:
					throw new Error(`Unrecognized EditType: ${this.state.editing}`);
			}
		}

		return (
			<>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
					}}
				>
					{this.renderMenu()}
					{view}
				</div>
				<Modal
					open={this.state.editing !== undefined}
					onClose={() => this.setIsEditing(undefined)}
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<ItemEditForm
						title={modalTitle}
						schemas={formSchemas}
						onSubmit={(item) => this.onInsertItem(item)}
					/>
				</Modal>
			</>
		);
	}

	private onInsertItem(item: Map<string, boolean | string | number>): void {
		console.log(`Adding item ${item.get('name')} to ${this.props.shopSelection}`);
		console.group();
		item.forEach((value, key) => {
			console.log(`${key}: ${value}`);
		});
		console.groupEnd();
		this.setIsEditing(undefined);
	}

	// TODO: de-dup with Contacts.
	private renderLoadingScreen(): React.ReactNode {
		return (
			<div
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					textAlign: 'center',
				}}
			>
				<div
					style={{
						padding: '15px',
					}}
				>
					Loading {this.props.shopSelection} inventory...
				</div>
				<div
					style={{
						padding: '15px',
						textAlign: 'center',
					}}
				>
					<div
						style={{
							display: 'inline-block',
						}}
					>
						<Spinner animation="border" variant="light"></Spinner>
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Render the shop-selection menu
	 */
	public renderMenu(): React.ReactNode {
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

	public renderApp(): React.ReactNode {
		return (
			<>
				<Scrollbars autoHide={true} autoHeight={false}>
					<div style={{ height: '100%', padding: '5px' }}>
						{this.renderInventory()}
						{this.renderInsertFooter()}
					</div>
				</Scrollbars>
			</>
		);
	}

	/**
	 * Renders the inventory view for the indicated shop
	 */
	public renderInventory(): React.ReactNode {
		return (
			<Table bordered hover responsive striped variant="dark">
				{this.renderHeader()}
				{this.renderInventoryData()}
			</Table>
		);
	}

	/**
	 * Renders the inventory header.
	 */
	private renderHeader(): React.ReactNode {
		return (
			<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Weight (lb)</th>
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
	private renderInventoryData(): React.ReactNode {
		if (!this.props.inventory) {
			throw new Error('Inventory not loaded.');
		}
		return (
			<tbody>
				{this.props.inventory.map((row) => {
					return <React.Fragment key={row.name}>{this.renderRow(row)}</React.Fragment>;
				})}
			</tbody>
		);
	}

	/**
	 * Renders a data row
	 */
	private renderRow(row: InventoryItem): React.ReactNode {
		return (
			<tr>
				<td>
					<a href={getResourceUrl(row)} target="_blank" rel="noopener noreferrer">
						{row.name}
					</a>
				</td>
				<td>{row.type}</td>
				<td>{row.weight}</td>
				{/* TODO: handle custom table data */}
				<td>{row.cost}</td>
				<td>{row.stock < 0 ? '∞' : row.stock}</td>
				{canEdit ? (
					<td>
						<Button onClick={() => this.setIsEditing(EditType.Edit)}>
							<CreateIcon color="secondary" />
						</Button>
						<Button
							onClick={() => {
								/* TODO: delete item (after confirmation modal) */
							}}
						>
							<DeleteForeverIcon color="secondary" />
						</Button>
					</td>
				) : (
					<></>
				)}
			</tr>
		);
	}

	// TODO: upon clicking button, open up modal form for inserting new item.
	/**
	 * Renders an "insert new item" footer iff the user is permitted to make edits.
	 */
	private renderInsertFooter(): React.ReactNode {
		if (canEdit) {
			return (
				<div
					style={{
						display: 'flex',
						flexDirection: 'row-reverse',
						margin: '5px',
					}}
				>
					<Button
						variant="outlined"
						color="secondary"
						onClick={() => this.setIsEditing(EditType.Insert)}
					>
						<AddIcon color="secondary" />
					</Button>
				</div>
			);
		}
		return <></>;
	}
}

/**
 * Gets the resource url for the provided item. Gets it from the item itself if present, otherwise
 * generates a default.
 */
function getResourceUrl(item: InventoryItem): string {
	if (item.resourceUrl) {
		return item.resourceUrl;
	}
	// TODO: use a better link mechanism here
	return `https://sw5e.com/searchResults?searchText=${encodeURIComponent(item.name)}`;
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
