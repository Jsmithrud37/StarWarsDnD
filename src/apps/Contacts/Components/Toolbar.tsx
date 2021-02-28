import React, { ChangeEvent } from 'react';
import {
	TextField,
	AppBar,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	withWidth,
	WithWidth,
	IconButton,
	Modal,
	Card,
	List,
	ListItem,
} from '@material-ui/core';
import { background3 } from '../../../Theming';
import FilterListIcon from '@material-ui/icons/FilterList';
import RefreshIcon from '@material-ui/icons/Refresh';
import { SortBy } from './SortingAndFiltering';

type Props = WithWidth & {
	currentSortBy: SortBy;
	onUpdateSortBy: (newValue: SortBy) => void;
	currentNameFilter: string;
	onUpdateNameFilter: (newValue: string) => void;
	currentKnownBySelection: string;
	knownByOptions: string[];
	onUpdateKnownBySelection: (newKnownBySelection: string) => void;
	currentFactionSelection: string;
	factionOptions: string[];
	onUpdateFactionSelection: (newFactionSelection: string) => void;
	onClearAllFilters: () => void;
};

class Toolbar extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render(): React.ReactNode {
		const useNarrowView = this.props.width === 'sm';
		return (
			<AppBar
				id="contacts-toolbar"
				position="static"
				style={{
					backgroundColor: background3,
					padding: '3px',
				}}
			>
				{useNarrowView ? (
					<NarrowToolbar {...this.props} />
				) : (
					<WideToolbar {...this.props} />
				)}
			</AppBar>
		);
	}
}

class WideToolbar extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render(): React.ReactNode {
		return (
			<div
				id="contacts-toolbar-div"
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<div
					id="contacts-toolbar-filters"
					style={{
						display: 'flex',
						flexDirection: 'row',
					}}
				>
					{renderSortByDropDown(this.props.currentSortBy, this.props.onUpdateSortBy)}
					{renderNameFilterBox(
						this.props.currentNameFilter,
						this.props.onUpdateNameFilter,
					)}
					{renderKnownByFilterDropDown(
						this.props.currentKnownBySelection,
						this.props.knownByOptions,
						this.props.onUpdateKnownBySelection,
					)}
					{renderFactionFilterDropDown(
						this.props.currentFactionSelection,
						this.props.factionOptions,
						this.props.onUpdateFactionSelection,
					)}
				</div>
				<IconButton onClick={() => this.props.onClearAllFilters()}>
					<RefreshIcon />
				</IconButton>
			</div>
		);
	}
}

interface NarrowToolbarState {
	filterMenuOpen: boolean;
}

class NarrowToolbar extends React.Component<Props, NarrowToolbarState> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			filterMenuOpen: false,
		};
	}

	private toggleFilterMenuState(newState: boolean): void {
		this.setState({
			...this.state,
			filterMenuOpen: newState,
		});
	}

	public render(): React.ReactElement {
		return (
			<div
				id="contacts-toolbar-div"
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				{this.renderOptionsModal()}
				<IconButton onClick={() => this.toggleFilterMenuState(!this.state.filterMenuOpen)}>
					<FilterListIcon />
				</IconButton>
				<IconButton onClick={() => this.props.onClearAllFilters()}>
					<RefreshIcon />
				</IconButton>
			</div>
		);
	}

	private renderOptionsModal(): React.ReactElement {
		return (
			<Modal
				open={this.state.filterMenuOpen}
				onClose={() => this.toggleFilterMenuState(false)}
			>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%, -50%)',
					}}
				>
					<Card
						style={{
							backgroundColor: background3,
							padding: '10px',
						}}
					>
						<div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										minHeight: '100%',
										padding: '5px',
									}}
								>
									<h4>Filters</h4>
								</div>
								<IconButton onClick={() => this.props.onClearAllFilters()}>
									<RefreshIcon />
								</IconButton>
							</div>
							<List>
								<ListItem>
									{renderSortByDropDown(
										this.props.currentSortBy,
										this.props.onUpdateSortBy,
									)}
								</ListItem>
								<ListItem>
									{renderNameFilterBox(
										this.props.currentNameFilter,
										this.props.onUpdateNameFilter,
									)}
								</ListItem>
								<ListItem>
									{renderKnownByFilterDropDown(
										this.props.currentKnownBySelection,
										this.props.knownByOptions,
										this.props.onUpdateKnownBySelection,
									)}
								</ListItem>
								<ListItem>
									{renderFactionFilterDropDown(
										this.props.currentFactionSelection,
										this.props.factionOptions,
										this.props.onUpdateKnownBySelection,
									)}
								</ListItem>
							</List>
						</div>
					</Card>
				</div>
			</Modal>
		);
	}
}

/**
 * Renders a drop-down selection for sorting the characters
 * @param currentSortBySelection - Currently selected sorting option
 * @param onUpdateSortBySelection - Callback to invoke when the sort-by selection changes
 */
function renderSortByDropDown(
	currentSortBySelection: SortBy,
	onUpdateSortBySelection: (newValue: SortBy) => void,
): React.ReactNode {
	return renderDropDown(
		currentSortBySelection,
		Object.values(SortBy),
		onUpdateSortBySelection,
		'Sort By',
		undefined, // No "all" option for this drop-down
		'sort-by-filter',
	);
}

/**
 * Renders a text-box based character name filter
 * @param currentNameFilter - Current value of the character name filter
 * @param onUpdateNameFilter - Callback to invoke when the filter value is updated
 */
function renderNameFilterBox(
	currentNameFilter: string,
	onUpdateNameFilter: (newValue: string) => void,
): React.ReactElement {
	return (
		<div
			style={{
				height: '100%',
				minWidth: '100px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-around',
				paddingLeft: '5px',
				paddingRight: '5px',
				textAlign: 'left',
			}}
		>
			<TextField
				type="search"
				value={currentNameFilter}
				label={`Filter Name`}
				id={`name_filter`}
				variant="outlined"
				multiline={false}
				size="small"
				onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
					onUpdateNameFilter(event.target.value?.toLocaleLowerCase())
				}
			/>
		</div>
	);
}

/**
 * Renders a drop-down selection filter for characters known by the player's character
 * @param currentKnownBySelection - Currently selected character for known-by filter
 * @param knownByOptions - Known-by options for the drop-down
 * @param onUpdateKnownBySelection - Callback to invoke when the known-by selection changes
 */
function renderKnownByFilterDropDown(
	currentKnownBySelection: string,
	knownByOptions: string[] | undefined,
	onUpdateKnownBySelection: (newValue: string) => void,
): React.ReactNode {
	// If the player has no characters, do not show filter menu
	if (!knownByOptions) {
		return React.Fragment;
	}

	return renderDropDown(
		currentKnownBySelection,
		knownByOptions,
		onUpdateKnownBySelection,
		'Known By',
		'All Contacts',
		'known-by-filter',
	);
}

/**
 * Renders a drop-down selection filter for Faction Affiliations
 * @param currentFactionSelection - Currently selected faction
 * @param factionOptions - Faction options for the drop-down
 * @param onUpdateFactionSelection - Callback to invoke when the faction selection changes
 */
function renderFactionFilterDropDown(
	currentFactionSelection: string,
	factionOptions: string[],
	onUpdateFactionSelection: (newValue: string) => void,
): React.ReactElement {
	return renderDropDown(
		currentFactionSelection,
		factionOptions,
		onUpdateFactionSelection,
		'Filter Affiliation',
		'All Factions',
		'faction-filter',
	);
}

/**
 * Renders a drop-down selection filter
 * @param currentSelection - Currently selected value
 * @param options - Options for the drop-down
 * @param onUpdateSelection - Callback to invoke when the selection changes
 * @param label - Label to display on the drop-down UI element
 * @param allOptionString - Label to display for the "all" option.
 * If list does not have an "all" option, specify undefined.
 * @param keyPreamble - Value to preface all option keys with
 */
function renderDropDown<T extends string>(
	currentSelection: T | undefined,
	options: T[],
	onUpdateSelection: (newValue: T) => void,
	label: string,
	allOptionString: string | undefined,
	keyPreamble: string,
): React.ReactElement {
	if (currentSelection && !options.includes(currentSelection)) {
		throw new Error(
			`Selected option "${currentSelection}" is not one of the specified options for dropdown "${label}".`,
		);
	}

	const filterOptions: React.ReactNodeArray = [];

	if (allOptionString) {
		filterOptions.push(
			<MenuItem key={`${keyPreamble}-option-none`} value={undefined}>
				<em>{allOptionString}</em>
			</MenuItem>,
		);
	}

	options.forEach((option) => {
		filterOptions.push(
			<MenuItem key={`${keyPreamble}-option-${option}`} value={option}>
				{option}
			</MenuItem>,
		);
	});

	const labelId = `${keyPreamble}-label`;

	return (
		<div
			style={{
				height: '100%',
				minWidth: '160px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-around',
				paddingLeft: '5px',
				paddingRight: '5px',
				textAlign: 'left',
			}}
		>
			<FormControl variant="outlined" size="small">
				<InputLabel id={labelId}>{label}</InputLabel>
				<Select
					id={`${keyPreamble}-select`}
					labelId={labelId}
					label={label}
					value={currentSelection}
					onChange={(event) => onUpdateSelection(event.target.value as T)}
					variant="outlined"
					style={{
						backgroundColor: background3,
					}}
				>
					{filterOptions}
				</Select>
			</FormControl>
		</div>
	);
}

export default withWidth()(Toolbar);
