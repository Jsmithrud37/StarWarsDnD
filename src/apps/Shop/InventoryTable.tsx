import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	TablePagination,
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
		};
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
									onClick={() => this.props.onInsertItem()}
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
		const firstItemOnPageIndex = this.state.selectedPageIndex * this.state.rowsPerPage;
		const rowsToRender = this.props.inventory.slice(
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
				<TableCell align={'center'}>
					<a href={getResourceUrl(item)} target="_blank" rel="noopener noreferrer">
						{item.name}
					</a>
				</TableCell>
				<TableCell align={'center'}>{item.category}</TableCell>
				<TableCell align={'center'}>{item.type}</TableCell>
				<TableCell align={'center'}>{item.subType}</TableCell>
				<TableCell align={'center'}>{item.rarity}</TableCell>
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
