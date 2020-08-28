import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	TablePagination,
	TableSortLabel,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Inventory, InventoryItem } from './Inventory';
import { background2 } from '../../Theming';

/**
 * Component props
 */
interface Props {
	inventory: Inventory;

	onInsertItem: () => void;
	onEditItem: (item: InventoryItem) => void;
	onDeleteItem: (item: InventoryItem) => void;
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
}

/**
 * Whether or not inventories may be edited.
 * TODO: permissions based on user roles.
 */
const canEdit = process.env.NODE_ENV !== 'production';

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
		};
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
		const newPageIndex = 0; // TODO: find page containing first item on existing page?
		this.setState({
			...this.state,
			rowsPerPage: newRowsPerPage,
			selectedPageIndex: newPageIndex,
		});
	}

	public render(): React.ReactNode {
		return (
			<Scrollbars autoHide={true} autoHeight={false}>
				<div style={{ height: '100%', padding: '5px' }}>
					<TableContainer>
						<Table stickyHeader={true}>
							{this.renderHeader()}
							{this.renderInventoryData()}
						</Table>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={this.props.inventory.length}
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
					{this.renderHeaderCell('Name', 'name')}
					{this.renderHeaderCell('Category', 'category')}
					{this.renderHeaderCell('Type', 'type')}
					{this.renderHeaderCell('Sub-Type', 'subType')}
					{this.renderHeaderCell('Rarity', 'rarity')}
					{this.renderHeaderCell('Weight (lb)', 'weight')}
					{this.renderHeaderCell(
						<>
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
						</>,
						'cost',
					)}
					{this.renderHeaderCell('Stock', 'stock')}
					{canEdit ? (
						<TableCell
							key={'editing'}
							align={'center'}
							style={{
								background: background2,
							}}
						>
							<Button
								variant="outlined"
								color="secondary"
								onClick={() => this.props.onInsertItem()}
							>
								<AddIcon color="secondary" />
							</Button>
						</TableCell>
					) : (
						React.Fragment
					)}
				</TableRow>
			</TableHead>
		);
	}

	private renderHeaderCell(child: React.ReactElement | string, key: string): React.ReactNode {
		const sortedColumn = key === this.state.sortingColumnKey;

		return (
			<TableCell
				key={key}
				align={'center'}
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
	 * Renders the table body.
	 */
	private renderInventoryData(): React.ReactNode {
		// TODO: this is needlessly expensive...
		const sortedInventory = this.props.inventory.sort((a, b) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const aKey: string = (a as any)[this.state.sortingColumnKey].toString();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const bKey: string = (b as any)[this.state.sortingColumnKey].toString();
			const compare = aKey.localeCompare(bKey);
			return this.state.sortInAscendingOrder ? compare : -compare;
		});

		const firstItemOnPageIndex = this.state.selectedPageIndex * this.state.rowsPerPage;
		const rowsToRender = sortedInventory.slice(
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
				<TableCell align={'center'}>{item.weight}</TableCell>
				<TableCell align={'center'}>{item.cost}</TableCell>
				<TableCell align={'center'}>{item.stock < 0 ? '∞' : item.stock}</TableCell>
				{canEdit ? (
					<TableCell align={'center'}>
						<Button onClick={() => this.props.onEditItem(item)}>
							<CreateIcon color="secondary" />
						</Button>
						<Button
							onClick={() => {
								this.props.onDeleteItem(item);
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
