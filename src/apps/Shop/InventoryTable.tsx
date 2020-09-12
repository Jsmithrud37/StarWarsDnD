import {
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	TablePagination,
	TableSortLabel,
	Checkbox,
	TextField,
	FormControl,
	FormControlLabel,
	InputLabel,
	Select,
	MenuItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import React, { ChangeEvent, CSSProperties } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Inventory, InventoryItem } from './Inventory';
import { background2, background4 } from '../../Theming';

/**
 * Component props
 */
interface Props {
	inventory: Inventory;

	onInsertItem: () => void;
	onEditItem: (editedItem: InventoryItem) => void;
	onDeleteItem: (item: InventoryItem) => void;
	onPurchaseItem: (item: InventoryItem) => void;
}

/**
 * Component state
 */
interface State {
	/**
	 * The number of rows to be rendered per page in the table. Can be edited by the user.
	 */
	rowsPerPage: number;

	/**
	 * Currently selected page index.
	 */
	selectedPageIndex: number;

	/**
	 * Indicates the column by which the table contents are currently sorted.
	 */
	sortingColumnKey: string;

	/**
	 * Whether or not the sorted column is sorted in `ascending` or `descending` order.
	 */
	sortInAscendingOrder: boolean;

	/**
	 * Applied text-box-backed filters. These will be consumed in substring checks (if property
	 * contains filter).
	 *
	 */
	textBoxFilters: Map<string, string>;

	/**
	 * Applied drop-down-based filters. These will be consumed in exact equality checks.
	 */
	dropDownFilters: Map<string, string>;

	/**
	 * Will only show items that are in stock and purchasable
	 */
	showOnlyInStock: boolean;
}

/**
 * Whether or not inventories may be edited.
 * TODO: permissions based on user roles.
 */
const canEdit = process.env.NODE_ENV !== 'production';

const filterBarItemStyle: CSSProperties = {
	height: '100%',
	minWidth: '150px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
	paddingLeft: '5px',
	paddingRight: '5px',
	textAlign: 'left',
};

/**
 * Inventory table component
 */
export class InventoryTable extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			rowsPerPage: 10, // TODO: different on mobile v desktop?
			selectedPageIndex: 0,
			sortingColumnKey: 'name',
			sortInAscendingOrder: true,
			textBoxFilters: new Map<string, string>(),
			dropDownFilters: new Map<string, string>(),
			showOnlyInStock: false,
		};
	}

	private getModifiedInventory(): Inventory {
		const sortedInventory = this.sortInventory(this.props.inventory);
		return this.applyFilters(sortedInventory);
	}

	private onChangePage(newPageSelection: number): void {
		this.setState({
			...this.state,
			selectedPageIndex: newPageSelection,
		});
	}

	private onSortColumn(columnKey: string, ascending: boolean): void {
		this.setState({
			...this.state,
			selectedPageIndex: 0, // Set page back to 0 when sorting changes
			sortingColumnKey: columnKey,
			sortInAscendingOrder: ascending,
		});
	}

	private onChangeRowsPerPage(newRowsPerPage: number): void {
		if (newRowsPerPage <= 0) {
			throw new Error(`Invalid "rowsPerPage" value: ${newRowsPerPage}`);
		}
		const newPageIndex = 0;
		this.setState({
			...this.state,
			rowsPerPage: newRowsPerPage,
			selectedPageIndex: newPageIndex,
		});
	}

	private updateTextBoxFilter(field: string, value: string): void {
		const filters = this.state.textBoxFilters;
		filters.set(field, value);
		this.setState({
			...this.state,
			textBoxFilters: filters,
			selectedPageIndex: 0, // Reset page to 0 for filter change
		});
	}

	private updateDropDownFilter(field: string, value: string): void {
		const filters = this.state.dropDownFilters;
		filters.set(field, value);
		this.setState({
			...this.state,
			dropDownFilters: filters,
			selectedPageIndex: 0, // Reset page to 0 for filter change
		});
	}

	private toggleShowStock(): void {
		this.setState({
			...this.state,
			showOnlyInStock: !this.state.showOnlyInStock,
			selectedPageIndex: 0, // Reset page to 0 for filter change
		});
	}

	public render(): React.ReactNode {
		const modifiedInventory = this.getModifiedInventory();

		return (
			<Scrollbars autoHide={true} autoHeight={false}>
				<div style={{ height: '100%', width: '100%', padding: '5px' }}>
					<TableContainer style={{ width: '100%' }}>
						{this.renderFilterOptions()}
						<Table stickyHeader={true} size="small">
							{this.renderHeader()}
							{this.renderInventoryData(modifiedInventory)}
						</Table>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, 100]}
							component="div"
							count={modifiedInventory.length}
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
				</div>
			</Scrollbars>
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
					{this.renderHeaderCell('Name', 'name', 'left')}
					{this.renderHeaderCell('Category', 'category', 'left')}
					{this.renderHeaderCell('Type', 'type', 'left')}
					{this.renderHeaderCell('Sub-Type', 'subType', 'left')}
					{this.renderHeaderCell('Rarity', 'rarity', 'left')}
					{this.renderHeaderCell('Weight (lb)', 'weight', 'right')}
					{this.renderHeaderCell(
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
							}}
						>
							<div>
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
							</div>
						</div>,
						'cost',
						'right',
					)}
					{this.renderHeaderCell('Stock', 'stock', 'right')}

					<TableCell
						key={'editing'}
						align={'center'}
						style={{
							background: background2,
						}}
					>
						{canEdit ? (
							<IconButton
								color="secondary"
								size="small"
								onClick={() => this.props.onInsertItem()}
							>
								<AddIcon color="secondary" />
							</IconButton>
						) : (
							React.Fragment
						)}
					</TableCell>
				</TableRow>
			</TableHead>
		);
	}

	private renderHeaderCell(
		child: React.ReactElement | string,
		key: string,
		align: 'left' | 'center' | 'right',
	): React.ReactNode {
		const sortedColumn = key === this.state.sortingColumnKey;

		return (
			<TableCell
				key={key}
				align={align}
				style={{
					background: background2,
				}}
			>
				<TableSortLabel
					active={sortedColumn}
					direction={this.state.sortInAscendingOrder ? 'asc' : 'desc'}
					onClick={() =>
						this.onSortColumn(
							key,
							sortedColumn ? !this.state.sortInAscendingOrder : true,
						)
					}
				>
					{child}
				</TableSortLabel>
			</TableCell>
		);
	}

	/**
	 * Renders the inventory header.
	 */
	private renderFilterOptions(): React.ReactNode {
		return (
			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: '5px',
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
					}}
				>
					{this.renderTextFilterCell('Name', 'name')}
					{this.renderDropDownFilterCell('Category', 'category')}
					{this.renderDropDownFilterCell('Type', 'type')}
					{this.renderDropDownFilterCell('Sub-Type', 'subType')}
					{this.renderDropDownFilterCell('Rarity', 'rarity')}
					<div style={filterBarItemStyle}>
						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.showOnlyInStock}
									onChange={() => this.toggleShowStock()}
									color="primary"
								/>
							}
							label="Show only in stock"
						/>
					</div>
				</div>
			</div>
		);
	}

	private renderTextFilterCell(label: string, field: string): React.ReactNode {
		const currentFilter = this.state.textBoxFilters.get(field);
		return (
			<div style={filterBarItemStyle}>
				<TextField
					type="search"
					defaultValue={currentFilter}
					label={`Filter ${label}`}
					id={`${field}_filter`}
					variant="outlined"
					multiline={false}
					size="small"
					onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
						this.updateTextBoxFilter(field, event.target.value)
					}
				/>
			</div>
		);
	}

	private renderDropDownFilterCell(label: string, field: string): React.ReactNode {
		const formLabelId = 'faction-filter-label';
		const formLabel = `Filter ${label}`;

		const currentFilter = this.state.textBoxFilters.get(field);

		const filterOptions = getFilterOptions(this.props.inventory, field);
		const menuOptions: React.ReactNodeArray = [
			<MenuItem key={`${field}-filter-option-none`} value={undefined}>
				<em>None</em>
			</MenuItem>,
		];
		filterOptions.forEach((faction) => {
			menuOptions.push(
				<MenuItem key={`${field}-filter-option-${faction}`} value={faction}>
					{faction}
				</MenuItem>,
			);
		});

		return (
			<div style={filterBarItemStyle}>
				<FormControl variant="outlined" size="small">
					<InputLabel id={formLabelId}>{formLabel}</InputLabel>
					<Select
						id={`${field}-filter-select`}
						labelId={formLabelId}
						label={formLabel}
						value={currentFilter}
						onChange={(event) =>
							this.updateDropDownFilter(field, event.target.value as string)
						}
						variant="outlined"
					>
						{menuOptions}
					</Select>
				</FormControl>
			</div>
		);
	}

	/**
	 * Renders the table body.
	 */
	private renderInventoryData(inventory: Inventory): React.ReactNode {
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
	private renderRow(item: InventoryItem): React.ReactNode {
		const inStock = item.stock !== 0;
		return (
			<TableRow
				hover
				style={{
					background: inStock ? undefined : background4,
				}}
			>
				<TableCell align={'left'}>
					<a href={getResourceUrl(item)} target="_blank" rel="noopener noreferrer">
						{item.name}
					</a>
				</TableCell>
				<TableCell align={'left'}>{item.category}</TableCell>
				<TableCell align={'left'}>{item.type}</TableCell>
				<TableCell align={'left'}>{item.subType}</TableCell>
				<TableCell align={'left'}>{item.rarity}</TableCell>
				<TableCell align={'right'}>{item.weight.toLocaleString()}</TableCell>
				<TableCell align={'right'}>{item.cost.toLocaleString()}</TableCell>
				<TableCell align={'right'}>
					{item.stock === -1 ? '∞' : item.stock.toLocaleString()}
				</TableCell>
				<TableCell align={'center'}>
					<IconButton
						size="small"
						onClick={() => this.props.onPurchaseItem(item)}
						disabled={!inStock}
					>
						<ShoppingCartIcon color={item.stock === 0 ? 'disabled' : 'primary'} />
					</IconButton>
					{canEdit ? (
						<>
							<IconButton size="small" onClick={() => this.props.onEditItem(item)}>
								<CreateIcon color="secondary" />
							</IconButton>
							<IconButton
								size="small"
								onClick={() => {
									this.props.onDeleteItem(item);
								}}
							>
								<DeleteForeverIcon color="secondary" />
							</IconButton>
						</>
					) : (
						<></>
					)}
				</TableCell>
			</TableRow>
		);
	}

	private sortInventory(inventory: Inventory): Inventory {
		return inventory.sort((a, b) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const aKey: string = (a as any)[this.state.sortingColumnKey].toString();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const bKey: string = (b as any)[this.state.sortingColumnKey].toString();

			// Note: for numeric values, we are treating `-1` as ∞. We will treat -1 as comparing
			// positive over anything else. If a string value legitimately has `-1`, this
			// may cause problems.
			let compare;
			if (aKey === '-1') {
				compare = 1;
			} else if (bKey === '-1') {
				compare = -1;
			} else {
				compare = aKey.localeCompare(bKey);
			}

			return this.state.sortInAscendingOrder ? compare : -compare;
		});
	}

	private applyFilters(inventory: Inventory): Inventory {
		let filteredInventory = inventory;

		// Filter out of stock items if specified
		if (this.state.showOnlyInStock) {
			filteredInventory = filteredInventory.filter((item) => item.stock !== 0);
		}

		// Apply text-based filters
		this.state.textBoxFilters.forEach((filterText, field) => {
			if (filterText) {
				filteredInventory = filteredInventory.filter((item) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const fieldValue = (item as any)[field].toString().toLocaleLowerCase();
					return fieldValue.includes(filterText);
				});
			}
		});

		// Apply drop-down-based filters
		this.state.dropDownFilters.forEach((filterOption, field) => {
			if (filterOption) {
				filteredInventory = filteredInventory.filter((item) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const fieldValue = (item as any)[field].toString();
					return fieldValue === filterOption;
				});
			}
		});

		return filteredInventory;
	}
}

/**
 * Generates options for field filters based on the values in the provided inventory
 * for the specified field.
 */
function getFilterOptions(inventory: Inventory, propertyName: string): string[] {
	const filterOptions: Set<string> = new Set<string>();

	for (const inventoryItem of inventory) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const value = (inventoryItem as any)[propertyName] as string;
		filterOptions.add(value);
	}

	const filterOptionsArray = Array.from(filterOptions.values());
	return filterOptionsArray.sort((a, b) => a.localeCompare(b));
}

/**
 * Gets the resource url for the provided item. Gets it from the item itself if present, otherwise
 * generates a default.
 */
function getResourceUrl(item: InventoryItem): string {
	if (item.resourceUrl) {
		return item.resourceUrl;
	}

	// Special-case enhanced items
	if (item.enhanced) {
		return `https://sw5e.com/loot/enhancedItems/?search=${encodeURIComponent(item.name)}`;
	}

	// Special case non-enhanced armor
	if (item.category.toLocaleLowerCase() === 'armor') {
		return `https://sw5e.com/loot/armor/?search=${encodeURIComponent(item.name)}`;
	}

	// Special case non-enhanced weapons
	if (item.category.toLocaleLowerCase() === 'weapon') {
		return `https://sw5e.com/loot/weapons/?search=${encodeURIComponent(item.name)}`;
	}

	// If not enhanced, and not armor or weapon, must be adventuring gear
	return `https://sw5e.com/loot/adventuringGear/?search=${encodeURIComponent(item.name)}`;
}
