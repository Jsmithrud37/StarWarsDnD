import React from 'react';
import { connect } from 'react-redux';
import { Modal, Tabs, Tab, AppBar, Card, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
	DataEntry,
	NumberEntry,
	StringEntry,
	BooleanEntry,
} from '../../shared-components/EditItemForm/DataEntry';
import ItemEditForm, { EntryTypes } from '../../shared-components/EditItemForm/EditItemForm';
import { executeBackendFunction, QueryResult } from '../../utilities/NetlifyUtilities';
import { Actions, changeShop, loadInventory } from './Actions';
import { Inventory, InventoryItem } from './Inventory';
import { ShopId, shopIdFromString } from './ShopId';
import { AppState } from './State';
import LoadingScreen from '../../shared-components/LoadingScreen';
import { background3, background4, background2 } from '../../Theming';
import { InventoryTable } from './InventoryTable';
import ItemPurchaseDialogue from './ItemPurchaseDialogue';

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
	Purchase,
	Pending,
}

// TODO: get as component input
const newItemFormSchemas = new Map<string, DataEntry>([
	['name', new StringEntry('', 'Name', undefined, true, false)],
	['category', new StringEntry('', 'Category', undefined, true, false)],
	['type', new StringEntry('', 'Type', undefined, true, false)],
	['subType', new StringEntry('', 'Sub-Type', undefined, false, false)],
	['rarity', new StringEntry('', 'Rarity', undefined, true, false)],
	['weight', new NumberEntry(0, 'Weight(lb)', undefined, 0, Number.POSITIVE_INFINITY, true)],
	['cost', new NumberEntry(0, 'Cost (cr)', undefined, 0, Number.POSITIVE_INFINITY, false)],
	['stock', new NumberEntry(0, 'Stock', undefined, -1, Number.POSITIVE_INFINITY, false)],
	['resourceUrl', new StringEntry('', 'Custom Resource URL', undefined, false, false)],
	['enhanced', new BooleanEntry(false, 'Enhanced Item')],
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
			throw new Error('Inventory fetch failed.');
		}
	}

	private createItemFromProperties(itemProperties: Map<string, EntryTypes>): InventoryItem {
		// Create new item from provided properties mapping
		const item: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
		itemProperties.forEach((value, key) => {
			item[key] = value;
		});

		return item as InventoryItem;
	}

	private async onSubmitInsert(itemProperties: Map<string, EntryTypes>): Promise<void> {
		const item = this.createItemFromProperties(itemProperties);

		console.log(`Adding item "${item.name}" to ${this.props.shopSelection}...`);

		const currentInventory = this.currentInventory();
		if (!currentInventory) {
			throw new Error('Attempted to edit item while inventory was not loaded.');
		}

		// Reload inventory with new item to update local store
		// TODO: add helper to props for inserting item so we don't have to blow away entire inventory
		const newInventory: Inventory = [...currentInventory, item];
		this.props.loadInventory(this.props.shopSelection, newInventory);
		this.setIsEditing(undefined);

		// Submit insert request to the backend
		const insertInventoryItemFunction = 'InsertInventoryItem';
		const result = this.onSubmitInsertOrEdit(item, insertInventoryItemFunction);

		if (!result) {
			throw new Error('Item submit failed.');
		}
	}

	private async onSubmitEdit(itemProperties: Map<string, EntryTypes>): Promise<void> {
		if (itemProperties.has('name')) {
			throw new Error('Cannot edit the `name` field of an item.');
		}
		if (!this.state.itemBeingEdited) {
			throw new Error('Invalid state: item being edited not set.');
		}

		itemProperties.set('name', this.state.itemBeingEdited.name);
		const edittedItem = this.createItemFromProperties(itemProperties);

		console.log(`Editing item "${edittedItem.name}" in ${this.props.shopSelection}...`);

		const currentInventory = this.currentInventory();
		if (!currentInventory) {
			throw new Error('Attempted to edit item while inventory was not loaded.');
		}

		// Set edit state to `Pending` to show spinner until backend request has completed.
		this.setIsEditing(EditType.Pending, this.state.itemBeingEdited);

		// Submit edit request to the backend
		const editInventoryItemFunction = 'EditInventoryItem';
		const result = await this.onSubmitInsertOrEdit(edittedItem, editInventoryItemFunction);

		if (!result) {
			throw new Error('Item edit failed.');
		}

		// Replace the edited item with the new value
		// TODO: add helper to props for editing item so we don't have to blow away entire inventory
		const newInventory: Inventory = currentInventory.map((item) => {
			return item.name === edittedItem.name ? edittedItem : item;
		});
		this.props.loadInventory(this.props.shopSelection, newInventory);
		this.setIsEditing(undefined);
	}

	private async onSubmitPurchase(purchasedItem: InventoryItem): Promise<void> {
		// TODO: wait for backend request to complete before editing local state and returning.
		// Also query for updated inventory before doing either - this way we get updated state
		// if others buy things while someone is looking at the inventory.

		const currentInventory = this.currentInventory();
		if (!currentInventory) {
			throw new Error('Attempted to edit item while inventory was not loaded.');
		}

		// `undefined` represents infinite stock. No need to submit an edit when purchasing an item with
		// infinite stock. The button at this point is really just for consistency / show (unless
		// eventually I decide to add character money management to the system... which, I mean...
		// maybe?)
		if (Number.isNaN(purchasedItem.stock)) {
			return;
		}

		if (purchasedItem.stock === 0) {
			throw new Error('Cannot purchase item with no stock.');
		}

		console.log(`Purchasing item "${purchasedItem.name}" from ${this.props.shopSelection}...`);

		// Set edit state to `Pending` to show spinner until backend request has completed.
		this.setIsEditing(EditType.Pending, this.state.itemBeingEdited);

		// TODO: replace the below logic with a specialized purchase request.
		// as written, if multiple people submit a buy at the same time, the inventory will
		// only be reduced once.
		const editInventoryItemFunction = 'EditInventoryItem';
		const itemWithEditedStock = {
			...purchasedItem,
			stock: purchasedItem.stock - 1,
		};
		const result = await this.onSubmitInsertOrEdit(
			itemWithEditedStock,
			editInventoryItemFunction,
		);

		if (!result) {
			throw new Error('Item purchase failed.');
		}

		// Replace the edited item with the new value
		// TODO: add helper to props for editing item so we don't have to blow away entire inventory
		const newInventory: Inventory = currentInventory.map((item) => {
			return item.name === purchasedItem.name ? itemWithEditedStock : item;
		});
		this.props.loadInventory(this.props.shopSelection, newInventory);
		this.setIsEditing(undefined);
	}

	private async onSubmitInsertOrEdit(
		item: InventoryItem,
		netlifyFunctionName: string,
	): Promise<QueryResult<ItemQueryResult>> {
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

	private async onSubmitDeleteItem(itemName: string): Promise<void> {
		interface DeleteItemQueryResult {
			shopName: string;
			item: InventoryItem;
		}

		console.log(`Deleting item "${itemName}" from ${this.props.shopSelection}...`);

		const currentInventory = this.currentInventory();
		if (!currentInventory) {
			throw new Error(`Attempting to delete item "${itemName}" from empty inventory.`);
		}

		// Set edit state to `Pending` to show spinner until backend request has completed.
		this.setIsEditing(EditType.Pending, this.state.itemBeingEdited);

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

		if (!result) {
			throw new Error('Item delete failed.');
		}

		// Reload inventory with new item to update local store
		// TODO: add helper to props for removing item so we don't have to blow away entire inventory
		const newInventory: Inventory = currentInventory.filter((value) => {
			return value.name !== itemName;
		});
		this.props.loadInventory(this.props.shopSelection, newInventory);

		this.setIsEditing(undefined);
	}

	private setIsEditing(value?: EditType, itemBeingEdited?: InventoryItem): void {
		this.setState({ ...this.state, editing: value, itemBeingEdited });
	}

	private reloadInventory(): void {
		this.props.loadInventory(this.props.shopSelection, undefined);
	}

	private createEditSchemas(item: InventoryItem): Map<string, DataEntry> {
		return new Map<string, DataEntry>([
			// Do not include name - we do not allow editing of name to guarantee we have
			// a baseline to compare with when modifying the inventory contents
			['category', new StringEntry(item.category, 'Category', undefined, true, false)],
			['type', new StringEntry(item.type, 'Type', undefined, true, false)],
			['subType', new StringEntry(item.subType ?? '', 'Sub-Type', undefined, false, false)],
			['rarity', new StringEntry(item.rarity, 'Rarity', undefined, true, false)],
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
					false,
					false,
				),
			],
			['enhanced', new BooleanEntry(item.enhanced ?? false, 'Enhanced Item')],
		]);
	}

	public render(): React.ReactNode {
		const inventory = this.currentInventory();

		// If inventory is loaded, render inventory table. Otherwise, issue fetch request and
		// display loading screen until it has returned.
		let view;
		if (inventory) {
			view = (
				<InventoryTable
					inventory={inventory}
					onInsertItem={() => this.setIsEditing(EditType.Insert)}
					onEditItem={(item) => this.setIsEditing(EditType.Edit, item)}
					onDeleteItem={(item) => this.onSubmitDeleteItem(item.name)}
					onPurchaseItem={(item) => this.setIsEditing(EditType.Purchase, item)}
				/>
			);
		} else {
			this.fetchInventory();
			view = <LoadingScreen text={`Loading ${this.props.shopSelection} inventory...`} />;
		}

		// Render item-edit form. Will only be displayed if in editing mode, as a modal dialogue.
		let modalContent: React.ReactElement = <></>;
		if (this.state.editing !== undefined) {
			modalContent = this.renderEditForm();
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
					onClose={() => this.setIsEditing(undefined, undefined)}
					style={
						{
							// width: '100%',
							// display: 'flex',
							// flexDirection: 'column',
							// justifyContent: 'center',
						}
					}
				>
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					>
						{modalContent}
					</div>
				</Modal>
			</>
		);
	}

	private renderEditForm(): React.ReactElement {
		const editingMode = this.state.editing;
		if (editingMode === undefined) {
			throw new Error('Editing is not set');
		}

		const itemBeingEdited = this.state.itemBeingEdited;

		switch (editingMode) {
			case EditType.Edit:
				if (!itemBeingEdited) {
					throw new Error('No item set for editing');
				}
				return (
					<ItemEditForm
						title={`Editing item: "${itemBeingEdited.name}"`}
						schemas={this.createEditSchemas(itemBeingEdited as InventoryItem)}
						onSubmit={(item) => this.onSubmitEdit(item)}
						onCancel={() => this.setIsEditing(undefined)}
					/>
				);
			case EditType.Insert:
				return (
					<ItemEditForm
						title="Insert new item"
						schemas={newItemFormSchemas}
						onSubmit={(item) => this.onSubmitInsert(item)}
						onCancel={() => this.setIsEditing(undefined)}
					/>
				);
			case EditType.Purchase:
				if (!itemBeingEdited) {
					throw new Error('No item set for editing');
				}
				return (
					<ItemPurchaseDialogue
						item={itemBeingEdited}
						onConfirm={() => this.onSubmitPurchase(itemBeingEdited)}
						onCancel={() => this.setIsEditing(undefined)}
					/>
				);
			case EditType.Pending:
				return (
					<Card
						style={{
							backgroundColor: background2,
							maxWidth: '400px',
						}}
					>
						<LoadingScreen />
					</Card>
				);
			default:
				throw new Error(`Unrecognized EditType: ${editingMode}`);
		}
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
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
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
				<div style={{ paddingRight: '15px' }}>
					<IconButton color="primary" onClick={() => this.reloadInventory()}>
						<RefreshIcon color="primary" />
					</IconButton>
				</div>
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
