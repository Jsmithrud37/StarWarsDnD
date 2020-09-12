import React from 'react';
import { Modal, Tabs, Tab, AppBar, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { executeBackendFunction, QueryResult } from '../../../utilities/NetlifyUtilities';
import { Actions } from '../Actions';
import { Inventory, InventoryItem } from '../Inventory';
import { ShopId, shopIdFromString } from '../ShopId';
import { AppState } from '../State';
import LoadingScreen from '../../../shared-components/LoadingScreen';
import { background3, background4 } from '../../../Theming';
import { InventoryTable } from './InventoryTable';
import ItemPurchaseDialogue from './ItemPurchaseDialogue';
import { InsertItemDialogue } from './InsertItemDialogue';
import { EditItemDialogue } from './EditItemDialogue';
import { PendingDialogue } from './PendingDialogue';

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
 * Shops {@link https://reactjs.org/docs/faq-state.html | Component State}
 */
type State = ModalState;

/**
 * Shops {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & AppState;

enum EditType {
	Insert,
	Edit,
	Purchase,
	Pending,
}

/**
 * Shops app component.
 */
export class Shops extends React.Component<Props, State> {
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

	private async onSubmitInsert(item: InventoryItem): Promise<void> {
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

	private async onSubmitEdit(editedItem: InventoryItem): Promise<void> {
		if (!this.state.itemBeingEdited) {
			throw new Error('Invalid state: item being edited not set.');
		}

		console.log(`Editing item "${editedItem.name}" in ${this.props.shopSelection}...`);

		const currentInventory = this.currentInventory();
		if (!currentInventory) {
			throw new Error('Attempted to edit item while inventory was not loaded.');
		}

		// Set edit state to `Pending` to show spinner until backend request has completed.
		this.setIsEditing(EditType.Pending, this.state.itemBeingEdited);

		// Submit edit request to the backend
		const editInventoryItemFunction = 'EditInventoryItem';
		const result = await this.onSubmitInsertOrEdit(editedItem, editInventoryItemFunction);

		if (!result) {
			throw new Error('Item edit failed.');
		}

		// Replace the edited item with the new value
		// TODO: add helper to props for editing item so we don't have to blow away entire inventory
		const newInventory: Inventory = currentInventory.map((item) => {
			return editedItem.name === item.name ? editedItem : item;
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

		// We use -1 to represent infinite quantity. If infinite, no need to submit edit to
		// the backend.
		if (purchasedItem.stock === -1) {
			this.setIsEditing(undefined);
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
					<EditItemDialogue
						itemBeingEdited={itemBeingEdited}
						onSubmit={(item) => this.onSubmitEdit(item)}
						onCancel={() => this.setIsEditing(undefined)}
					/>
				);
			case EditType.Insert:
				return (
					<InsertItemDialogue
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
				return <PendingDialogue />;
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
