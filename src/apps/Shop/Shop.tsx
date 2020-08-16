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
import { executeBackendFunction, QueryResult } from '../../utilities/NetlifyUtilities';
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

	/**
	 * When `editing` is set to `Edit`, this will be the item currently undergoing editing.
	 * Should only ever be defined when `editing` is set to `Edit`.
	 */
	itemBeingEdited?: InventoryItem;
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
	Pending,
}

// TODO: get as component input
const newItemFormSchemas = new Map<string, DataEntry>([
	['name', new StringEntry('', 'Name', undefined, false, false)],
	['category', new StringEntry('', 'Category', undefined, false, false)],
	['type', new StringEntry('', 'Type', undefined, false, false)],
	['subType', new StringEntry('', 'Sub-Type', undefined, true, false)],
	['rarity', new StringEntry('', 'Rarity', undefined, false, false)],
	['weight', new NumberEntry(0, 'Weight(lb)', undefined, 0, Number.POSITIVE_INFINITY, true)],
	['cost', new NumberEntry(0, 'Cost (cr)', undefined, 0, Number.POSITIVE_INFINITY, false)],
	['stock', new NumberEntry(0, 'Stock', undefined, -1, Number.POSITIVE_INFINITY, false)],
	['resourceUrl', new StringEntry('', 'Custom Resource URL', undefined, true, false)],
]);

/**
 *Shop main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
class ShopComponent extends React.Component<Props, ModalState> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			editing: undefined,
			itemBeingEdited: undefined,
		};
	}

	private async fetchInventory(): Promise<void> {
		interface FetchInventoryResult {
			shopName: string;
			inventory: Inventory;
		}

		const getInventoryFunction = 'GetShopInventory';
		const getInventoryParameters = [
			{
				name: 'shopName',
				value: this.props.shopSelection.toLowerCase(), // TODO: find a way to not have to do this here
			},
		];
		const response = await executeBackendFunction<FetchInventoryResult>(
			getInventoryFunction,
			getInventoryParameters,
		);
		if (response) {
			// If the shop selection has changed since we requested inventory from the server,
			// disregard the response.
			if (response.shopName === this.props.shopSelection.toLowerCase()) {
				// TODO: is this check needed?
				const inventory: Inventory = response.inventory;
				if (inventory.length > 0) {
					this.props.loadInventory(inventory);
				}
			}
		} else {
			// TODO: Report error message
		}
	}

	private createItemFromProperties(
		itemProperties: Map<string, boolean | string | number>,
	): InventoryItem {
		// Create new item from provided properties mapping
		const item: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
		itemProperties.forEach((value, key) => {
			item[key] = value;
		});

		return item as InventoryItem;
	}

	private async onSubmitInsert(
		itemProperties: Map<string, boolean | string | number>,
	): Promise<void> {
		const item = this.createItemFromProperties(itemProperties);

		console.log(`Adding item "${item.name}" to ${this.props.shopSelection}`);

		const insertInventoryItemFunction = 'InsertInventoryItem';
		const result = this.onSubmitInsertOrEdit(item, insertInventoryItemFunction);

		if (result && this.props.inventory) {
			// Reload inventory with new item to update local store
			// TODO: add helper to props for inserting item so we don't have to blow away entire inventory
			const newInventory: Inventory = [...this.props.inventory, item];
			this.props.loadInventory(newInventory);
			this.setIsEditing(undefined);
		} else {
			// TODO: Display error to user
		}
	}

	private async onSubmitEdit(
		itemProperties: Map<string, boolean | string | number>,
	): Promise<void> {
		if (itemProperties.has('name')) {
			throw new Error('Cannot edit the `name` field of an item.');
		}
		if (!this.state.itemBeingEdited) {
			throw new Error('Invalid state: item being edited not set.');
		}

		itemProperties.set('name', this.state.itemBeingEdited.name);

		const edittedItem = this.createItemFromProperties(itemProperties);

		console.log(`Editing item "${edittedItem.name}" in ${this.props.shopSelection}`);

		const editInventoryItemFunction = 'EditInventoryItem';
		const result = await this.onSubmitInsertOrEdit(edittedItem, editInventoryItemFunction);

		if (result && this.props.inventory) {
			// Replace the edited item with the new value
			// TODO: add helper to props for editing item so we don't have to blow away entire inventory
			const newInventory: Inventory = this.props.inventory.map((item) => {
				return item.name === edittedItem.name ? edittedItem : item;
			});
			this.props.loadInventory(newInventory);
			this.setIsEditing(undefined);
		} else {
			// TODO: Display error to user
		}
	}

	private async onSubmitInsertOrEdit(
		item: InventoryItem,
		netlifyFunctionName: string,
	): Promise<QueryResult<ItemQueryResult>> {
		// Set active state to "pending" so that component will show spinner
		// until we have gotten a response from the server.
		this.setIsEditing(EditType.Pending);

		// Submit new item to the server

		const queryParameters = [
			{
				name: 'shopName',
				value: this.props.shopSelection.toLowerCase(), // TODO: find a way to not have to do this here
			},
			{
				name: 'item',
				value: JSON.stringify(item),
			},
		];

		return executeBackendFunction<ItemQueryResult>(netlifyFunctionName, queryParameters);
	}

	private async onDeleteItem(itemName: string): Promise<void> {
		interface DeleteItemQueryResult {
			shopName: string;
			item: InventoryItem;
		}

		console.log(`Deleting item "${itemName}" from ${this.props.shopSelection}...`);

		// Set active state to "pending" so that component will show spinner
		// until we have gotten a response from the server.
		this.setIsEditing(EditType.Pending);

		// Submit new item to the server
		const deleteInventoryItemFunction = 'DeleteInventoryItem';
		const deleteInventoryItemParameters = [
			{
				name: 'shopName',
				value: this.props.shopSelection.toLowerCase(), // TODO: find a way to not have to do this here
			},
			{
				name: 'itemName',
				value: itemName,
			},
		];

		const result = await executeBackendFunction<DeleteItemQueryResult>(
			deleteInventoryItemFunction,
			deleteInventoryItemParameters,
		);

		if (result) {
			// Reload inventory with new item to update local store
			// TODO: add helper to props for removing item so we don't have to blow away entire inventory
			if (this.props.inventory) {
				const newInventory: Inventory = this.props.inventory.filter((value) => {
					return value.name !== itemName;
				});
				this.props.loadInventory(newInventory);
			}
			this.setIsEditing(undefined);
		} else {
			// TODO: display error to user
		}
	}

	private setIsEditing(value?: EditType, itemBeingEdited?: InventoryItem): void {
		this.setState({ ...this.state, editing: value, itemBeingEdited });
	}

	private createEditSchemas(item: InventoryItem): Map<string, DataEntry> {
		return new Map<string, DataEntry>([
			// Do not include name - we do not allow editing of name to guarantee we have
			// a baseline to compare with when modifying the inventory contents
			['category', new StringEntry(item.category, 'Category', undefined, false, false)],
			['type', new StringEntry(item.type, 'Type', undefined, false, false)],
			['subType', new StringEntry(item.subType ?? '', 'Sub-Type', undefined, true, false)],
			['rarity', new StringEntry(item.rarity, 'Rarity', undefined, false, false)],
			[
				'weight',
				new NumberEntry(
					item.weight,
					'Weight(lb)',
					undefined,
					0,
					Number.POSITIVE_INFINITY,
					true,
				),
			],
			[
				'cost',
				new NumberEntry(
					item.cost,
					'Cost (cr)',
					undefined,
					0,
					Number.POSITIVE_INFINITY,
					false,
				),
			],
			[
				'stock',
				new NumberEntry(
					item.stock,
					'Stock',
					undefined,
					-1,
					Number.POSITIVE_INFINITY,
					false,
				),
			],
			[
				'resourceUrl',
				new StringEntry(
					item.resourceUrl ?? '',
					'Custom Resource URL',
					undefined,
					true,
					false,
				),
			],
		]);
	}

	public render(): React.ReactNode {
		let view;
		if (!this.props.inventory) {
			this.fetchInventory();
			view = this.renderLoadingScreen();
		} else {
			view = this.renderApp();
		}

		let modalContent: React.ReactElement = <></>;
		if (this.state.editing !== undefined) {
			switch (this.state.editing) {
				case EditType.Edit:
					if (!this.state.itemBeingEdited) {
						throw new Error('Invalid state. Item being edited not set.');
					}
					modalContent = (
						<ItemEditForm
							title={`Editing item: "${this.state.itemBeingEdited.name}"`}
							schemas={this.createEditSchemas(
								this.state.itemBeingEdited as InventoryItem,
							)}
							onSubmit={(item) => this.onSubmitEdit(item)}
						/>
					);
					break;
				case EditType.Insert:
					modalContent = (
						<ItemEditForm
							title="Insert new item"
							schemas={newItemFormSchemas}
							onSubmit={(item) => this.onSubmitInsert(item)}
						/>
					);
					break;
				case EditType.Pending:
					modalContent = <Spinner animation="border" variant="light" />;
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
					{modalContent}
				</Modal>
			</>
		);
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
						<Spinner animation="border" variant="light" />
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
					<th>Category</th>
					<th>Type</th>
					<th>Sub-Type</th>
					<th>Rarity</th>
					<th>Weight (lb)</th>
					<th>
						Cost (
						<a
							href="https://sw5e.com/rules/phb/equipment#currency"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src="images/Credit.svg"
								alt="Galactic Credit"
								style={{
									height: '13px',
									margin: '2px',
									objectFit: 'scale-down',
								}}
							/>
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
				<td>{row.category}</td>
				<td>{row.type}</td>
				<td>{row.subType}</td>
				<td>{row.rarity}</td>
				<td>{row.weight}</td>
				<td>{row.cost}</td>
				<td>{row.stock < 0 ? '∞' : row.stock}</td>
				{canEdit ? (
					<td>
						<Button onClick={() => this.setIsEditing(EditType.Edit, row)}>
							<CreateIcon color="secondary" />
						</Button>
						<Button
							onClick={() => {
								this.onDeleteItem(row.name);
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
 * Query result for both insert and edit commands
 */
interface ItemQueryResult {
	shopName: string;
	item: InventoryItem;
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
