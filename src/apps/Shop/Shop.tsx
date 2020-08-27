import {
	Button,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	TablePagination,
	Tabs,
	Tab,
	AppBar,
	CircularProgress,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React from 'react';
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
import LoadingScreen from '../../shared-components/LoadingScreen';
import { background2, background3, background4 } from '../../Theming';

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
 * State related to the table being rendered.
 */
interface TableState {
	/**
	 * The number of rows to be rendered per page in the table. Can be edited by the user.
	 */
	rowsPerPage: number;

	/**
	 * Currently selected page index.
	 */
	selectedPageIndex: number;
}

type State = ModalState & TableState;

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
class ShopComponent extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			editing: undefined,
			itemBeingEdited: undefined,
			rowsPerPage: 10, // TODO: different on mobile v desktop?
			selectedPageIndex: 0,
		};
	}

	private currentInventory(): Inventory | undefined {
		return this.props.inventory.get(this.props.shopSelection);
	}

	private isInventoryLoaded(): boolean {
		return this.currentInventory() !== undefined;
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
					this.props.loadInventory(this.props.shopSelection, inventory);
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

	private onChangePage(newPageSelection: number): void {
		this.setState({
			...this.state,
			selectedPageIndex: newPageSelection,
		});
	}

	private onChangeRowsPerPage(newRowsPerPage: number): void {
		if (newRowsPerPage <= 0) {
			throw new Error(`Invalid "rowsPerPage" value: ${newRowsPerPage}`);
		}
		const newPageIndex = 0; // TODO: find page containing first item on existing page?
		this.setState({
			...this.state,
			rowsPerPage: newRowsPerPage,
			selectedPageIndex: newPageIndex,
		});
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
		if (this.isInventoryLoaded()) {
			view = this.renderApp();
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

	public renderApp(): React.ReactNode {
		return (
			<Scrollbars autoHide={true} autoHeight={false}>
				<div style={{ height: '100%', padding: '5px' }}>{this.renderInventory()}</div>
			</Scrollbars>
		);
	}

	/**
	 * Renders the inventory view for the indicated shop
	 */
	public renderInventory(): React.ReactNode {
		const inventory = this.currentInventory();
		if (!inventory) {
			throw new Error('Inventory not loaded yet.');
		}

		return (
			<TableContainer>
				<Table stickyHeader={true}>
					{this.renderHeader()}
					{this.renderInventoryData()}
				</Table>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={inventory.length}
					rowsPerPage={this.state.rowsPerPage}
					page={this.state.selectedPageIndex}
					onChangePage={(event, newPage) => this.onChangePage(newPage)}
					onChangeRowsPerPage={(event) =>
						this.onChangeRowsPerPage(parseInt(event.target.value, 10))
					}
					style={{
						backgroundColor: background2,
					}}
				/>
			</TableContainer>
		);
	}

	/**
	 * Renders the inventory header.
	 */
	private renderHeader(): React.ReactNode {
		return (
			<TableHead
				style={{
					background: background2,
				}}
			>
				<TableRow
					style={{
						background: background2,
					}}
				>
					{this.renderHeaderCell(<p>Name</p>, 'NameHeader')}
					{this.renderHeaderCell(<p>Category</p>, 'CategoryHeader')}
					{this.renderHeaderCell(<p>Type</p>, 'TypeHeader')}
					{this.renderHeaderCell(<p>Sub-Type</p>, 'SubTypeHeader')}
					{this.renderHeaderCell(<p>Rarity</p>, 'RarityHeader')}
					{this.renderHeaderCell(<p>Weight (lb)</p>, 'WeightHeader')}
					{this.renderHeaderCell(
						<p>
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
						</p>,
						'CostHeader',
					)}
					{this.renderHeaderCell(<p>Stock</p>, 'StockHeader')}
					{canEdit
						? this.renderHeaderCell(
								<Button
									variant="outlined"
									color="secondary"
									onClick={() => this.setIsEditing(EditType.Insert)}
								>
									<AddIcon color="secondary" />
								</Button>,
								'EditingHeader',
						  )
						: React.Fragment}
				</TableRow>
			</TableHead>
		);
	}

	private renderHeaderCell(child: React.ReactElement | string, key: string): React.ReactNode {
		return (
			<TableCell
				key={key}
				align={'center'}
				style={{
					background: background2,
				}}
			>
				{child}
			</TableCell>
		);
	}

	/**
	 * Renders the table body.
	 */
	private renderInventoryData(): React.ReactNode {
		const inventory = this.currentInventory();
		if (!inventory) {
			throw new Error('Inventory not loaded yet.');
		}

		const firstItemOnPageIndex = this.state.selectedPageIndex * this.state.rowsPerPage;
		const rowsToRender = inventory.slice(
			firstItemOnPageIndex,
			firstItemOnPageIndex + this.state.rowsPerPage,
		);

		return (
			<TableBody>
				{rowsToRender.map((row) => {
					return <React.Fragment key={row.name}>{this.renderRow(row)}</React.Fragment>;
				})}
			</TableBody>
		);
	}

	/**
	 * Renders a data row
	 */
	private renderRow(row: InventoryItem): React.ReactNode {
		return (
			<TableRow hover>
				<TableCell align={'center'}>
					<a href={getResourceUrl(row)} target="_blank" rel="noopener noreferrer">
						{row.name}
					</a>
				</TableCell>
				<TableCell align={'center'}>{row.category}</TableCell>
				<TableCell align={'center'}>{row.type}</TableCell>
				<TableCell align={'center'}>{row.subType}</TableCell>
				<TableCell align={'center'}>{row.rarity}</TableCell>
				<TableCell align={'center'}>{row.weight}</TableCell>
				<TableCell align={'center'}>{row.cost}</TableCell>
				<TableCell align={'center'}>{row.stock < 0 ? '∞' : row.stock}</TableCell>
				{canEdit ? (
					<TableCell align={'center'}>
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
					</TableCell>
				) : (
					<></>
				)}
			</TableRow>
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
