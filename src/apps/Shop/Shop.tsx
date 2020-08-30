import { Modal, Table, Tabs, Tab, AppBar, CircularProgress } from '@material-ui/core';
import React from 'react';
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
import { ShopId, shopIdFromString } from './ShopId';
import { AppState } from './State';
import LoadingScreen from '../../shared-components/LoadingScreen';
import { background3, background4 } from '../../Theming';
import { InventoryTable } from './InventoryTable';

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

type State = ModalState;

/**
 * Shop {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

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
class ShopComponent extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			editing: undefined,
			itemBeingEdited: undefined,
		};
	}

	private currentInventory(): Inventory | undefined {
		return this.props.inventory.get(this.props.shopSelection);
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
			// TODO: is this check needed?
			const inventory: Inventory = response.inventory;
			if (inventory.length > 0) {
				const shopId = shopIdFromString(response.shopName);
				this.props.loadInventory(shopId, inventory);
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

		const currentInventory = this.currentInventory();
		if (result && currentInventory) {
			// Reload inventory with new item to update local store
			// TODO: add helper to props for inserting item so we don't have to blow away entire inventory
			const newInventory: Inventory = [...currentInventory, item];
			this.props.loadInventory(this.props.shopSelection, newInventory);
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

		const currentInventory = this.currentInventory();
		if (result && currentInventory) {
			// Replace the edited item with the new value
			// TODO: add helper to props for editing item so we don't have to blow away entire inventory
			const newInventory: Inventory = currentInventory.map((item) => {
				return item.name === edittedItem.name ? edittedItem : item;
			});
			this.props.loadInventory(this.props.shopSelection, newInventory);
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

		const currentInventory = this.currentInventory();
		if (!currentInventory) {
			throw new Error(`Attempting to delete item "${itemName}" from empty inventory.`);
		}

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

			const newInventory: Inventory = currentInventory.filter((value) => {
				return value.name !== itemName;
			});
			this.props.loadInventory(this.props.shopSelection, newInventory);

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
		const inventory = this.currentInventory();

		let view;
		if (inventory) {
			view = (
				<InventoryTable
					inventory={inventory}
					onInsertItem={() => this.setIsEditing(EditType.Insert)}
					onEditItem={(item) => this.setIsEditing(EditType.Edit, item)}
					onDeleteItem={(item) => this.onDeleteItem(item.name)}
				/>
			);
		} else {
			this.fetchInventory();
			view = <LoadingScreen text={`Loading ${this.props.shopSelection} inventory...`} />;
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
					modalContent = <CircularProgress color="primary" />;
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
						backgroundColor: background3,
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

	/**
	 * Render the shop-selection menu
	 */
	public renderMenu(): React.ReactNode {
		return (
			<AppBar
				position="static"
				style={{
					backgroundColor: background4,
				}}
			>
				<Tabs
					orientation="horizontal"
					value={this.props.shopSelection}
					id="shops-menu"
					onChange={(event, newSelection) =>
						this.props.changeShop(newSelection as ShopId)
					}
				>
					{Object.values(ShopId).map((shop) => (
						<Tab value={shop} label={shop} key={shop} />
					))}
				</Tabs>
			</AppBar>
		);
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
