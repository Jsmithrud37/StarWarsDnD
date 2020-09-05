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
	Collapse,
	TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import React, { ChangeEvent, CSSProperties } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Inventory, InventoryItem } from './Inventory';
import { background2 } from '../../Theming';

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
	 * Determines whether or not the filter menu will be displayed.
	 */
	filterEnabled: boolean;

	/**
	 * Applied text filters.
	 */
	textFilters: Map<string, string>;

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
			filterEnabled: false,
			textFilters: new Map<string, string>(),
			showOnlyInStock: false,
		};
	}

	private getModifiedInventory(): Inventory {
		// TODO: this is needlessly expensive...
		const sortedInventory = this.sortInventory(this.props.inventory);
		return this.state.filterEnabled ? this.applyFilters(sortedInventory) : sortedInventory;
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

	private enableFilters(): void {
		this.setState({
			...this.state,
			filterEnabled: true,
			selectedPageIndex: 0, // Reset page to 0 for filter change
		});
	}

	private disableFilters(): void {
		this.setState({
			...this.state,
			filterEnabled: false,
			showOnlyInStock: false,
			selectedPageIndex: 0, // Reset page to 0 for filter change
		});
	}

	private updateFilter(field: string, value: string): void {
		const textFilters = this.state.textFilters;
		textFilters.set(field, value.toLocaleLowerCase());
		this.setState({
			...this.state,
			textFilters,
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
						<Collapse
							in={this.state.filterEnabled}
							style={{
								width: '100%',
							}}
						>
							{this.renderFilterOptions()}
						</Collapse>
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
						{!this.state.filterEnabled ? (
							<IconButton color="primary" onClick={() => this.enableFilters()}>
								<FilterListIcon color="primary" />
							</IconButton>
						) : (
							React.Fragment
						)}

						{canEdit ? (
							<IconButton color="secondary" onClick={() => this.props.onInsertItem()}>
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
						display: 'flex',
						flexDirection: 'row',
					}}
				>
					{this.renderTextFilterCell('Name', 'name')}
					{this.renderTextFilterCell('Category', 'category')}
					{this.renderTextFilterCell('Type', 'type')}
					{this.renderTextFilterCell('Sub-Type', 'subType')}
					{this.renderTextFilterCell('Rarity', 'rarity')}
					<div style={filterBarItemStyle}>
						<div>
							Show only in stock{' '}
							<Checkbox
								checked={this.state.showOnlyInStock}
								onChange={() => this.toggleShowStock()}
								color="primary"
							/>
						</div>
					</div>
				</div>
				<div>
					<div
						style={{
							height: '100%',
						}}
					>
						<IconButton color="primary" onClick={() => this.disableFilters()}>
							<CloseIcon color="primary" />
						</IconButton>
					</div>
				</div>
			</div>
		);
	}

	private renderTextFilterCell(label: string, field: string): React.ReactNode {
		const currentFilter = this.state.textFilters.get(field);
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
						this.updateFilter(field, event.target.value)
					}
				/>
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
		return (
			<TableRow hover>
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
						onClick={() => this.props.onPurchaseItem(item)}
						disabled={item.stock === 0}
					>
						<ShoppingCartIcon color={item.stock === 0 ? 'disabled' : 'primary'} />
					</IconButton>
					{canEdit ? (
						<>
							<IconButton onClick={() => this.props.onEditItem(item)}>
								<CreateIcon color="secondary" />
							</IconButton>
							<IconButton
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
		this.state.textFilters.forEach((filterText, field) => {
			filteredInventory = filteredInventory.filter((item) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const fieldValue = (item as any)[field].toString().toLocaleLowerCase();
				return fieldValue.includes(filterText);
			});
		});

		return filteredInventory;
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
