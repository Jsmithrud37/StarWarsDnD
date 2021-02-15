import React from 'react';
import { AppBar, Tab, Tabs, Modal } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import DescriptionIcon from '@material-ui/icons/Description';
import PeopleIcon from '@material-ui/icons/People';
import SwipeableViews from 'react-swipeable-views';
import { ImageContainerShape, renderContactImage } from '../../../utilities/ImageUtilities';
import { Contact, getContactCardColor } from '../Contact';
import { Scrollbars } from 'react-custom-scrollbars';
import { createContentColorForLevel } from '../../../Theming';
import { CharacterBasics } from '../../../shared-components/CharacterComponents/CharacterBasics';
import { CharacterAffiliations } from '../../../shared-components/CharacterComponents/CharacterAffiliations';
import { CharacterBio } from '../../../shared-components/CharacterComponents/CharacterBio';
import NoteIcon from '@material-ui/icons/Note';
import { Player } from '../../Datapad/Player';
import { ContactNotes } from './ContactNotes';

/**
 * Tabs in the contact card view
 */
enum DetailsTab {
	GeneralInfo,
	Affiliations,
	Bio,
	Notes,
}

const tabDivStyle = {
	width: '100%',
	padding: '10px',
};

/**
 * Gets the string representation of the provided tab type
 */
function stringFromTabType(tabType: DetailsTab): string {
	switch (tabType) {
		case DetailsTab.GeneralInfo:
			return 'General Info';
		case DetailsTab.Affiliations:
			return 'Affiliations';
		case DetailsTab.Bio:
			return 'Bio';
		case DetailsTab.Notes:
			return 'Notes';
		default:
			throw new Error(`Unrecognized DetailsTab value: ${tabType}`);
	}
}

export interface ContactCardProps {
	contact: Contact;
	heightInPixels: number;
	player: Player;
}

interface State {
	/**
	 * Selected tab in the contact details tab view
	 */
	selectedTab: DetailsTab;

	/**
	 * Whether or not the image modal should be displayed
	 */
	imageModal: boolean;
}

export class ContactDetails extends React.Component<ContactCardProps, State> {
	public constructor(props: ContactCardProps) {
		super(props);
		this.state = {
			selectedTab: DetailsTab.GeneralInfo,
			imageModal: false,
		};
	}

	toggleImageModal(shouldDisplay: boolean): void {
		this.setState({
			...this.state,
			imageModal: shouldDisplay,
		});
	}

	onTabSelection(newSelection: DetailsTab): void {
		this.setState({
			...this.state,
			selectedTab: newSelection,
		});
	}

	public render(): React.ReactNode {
		const basicsTab = this.renderBasicsTab();
		const affiliationsTab = this.renderAffiliationsTab();
		const bioTab = this.renderBioTab();
		const notesTab = this.renderNotesTab();

		const headerHeightInPixels = 48; // Seems to match the height of the buttons
		const bodyHeightInPixels = this.props.heightInPixels - headerHeightInPixels;

		const tabPanelStyle = {
			height: `${bodyHeightInPixels}px`,
			padding: '0px',
		};

		const tabPanels: React.ReactNodeArray = [
			<TabPanel
				key={DetailsTab.GeneralInfo}
				value={stringFromTabType(DetailsTab.GeneralInfo)}
				style={tabPanelStyle}
			>
				{basicsTab}
			</TabPanel>,
			<TabPanel
				key={DetailsTab.Affiliations}
				value={stringFromTabType(DetailsTab.Affiliations)}
				style={tabPanelStyle}
			>
				{affiliationsTab}
			</TabPanel>,
			<TabPanel
				key={DetailsTab.Bio}
				value={stringFromTabType(DetailsTab.Bio)}
				style={tabPanelStyle}
			>
				{bioTab}
			</TabPanel>,
			<TabPanel
				key={DetailsTab.Notes}
				value={stringFromTabType(DetailsTab.Notes)}
				style={tabPanelStyle}
			>
				{notesTab}
			</TabPanel>,
		];
		return (
			<div
				style={{
					maxHeight: `${this.props.heightInPixels}px`,
				}}
			>
				{this.renderContactModal()}
				<TabContext value={stringFromTabType(this.state.selectedTab)}>
					<AppBar
						position="static"
						style={{
							height: `${headerHeightInPixels}px`,
							backgroundColor: createContentColorForLevel(
								getContactCardColor(this.props.contact),
								4,
							),
						}}
					>
						<Tabs
							indicatorColor="primary"
							variant="scrollable"
							scrollButtons="auto"
							onChange={(event, newSelection) => this.onTabSelection(newSelection)}
							value={this.state.selectedTab}
						>
							<Tab
								icon={<PersonIcon color={'inherit'} />}
								color="inherit"
								value={DetailsTab.GeneralInfo}
							/>
							<Tab
								icon={<PeopleIcon color={'inherit'} />}
								color="inherit"
								value={DetailsTab.Affiliations}
							/>
							<Tab
								icon={<DescriptionIcon color={'inherit'} />}
								color="inherit"
								value={DetailsTab.Bio}
							/>
							<Tab
								icon={<NoteIcon color={'inherit'} />}
								color="inherit"
								value={DetailsTab.Notes}
							/>
						</Tabs>
					</AppBar>
					<SwipeableViews
						axis="x"
						index={this.state.selectedTab}
						onChangeIndex={(newSelection) => this.onTabSelection(newSelection)}
					>
						{tabPanels}
					</SwipeableViews>
				</TabContext>
			</div>
		);
	}

	private renderBasicsTab(): React.ReactNode {
		const maxImageDimensionInPixels = 150;
		const contactImage = renderContactImage(this.props.contact.name, {
			maxWidthInPixels: maxImageDimensionInPixels,
			maxHeightInPixels: maxImageDimensionInPixels,
			containerShape: ImageContainerShape.RoundedRectangle,
		});

		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<div style={tabDivStyle} onClick={() => this.toggleImageModal(true)}>
					{contactImage}
				</div>
				<CharacterBasics character={this.props.contact} />
			</Scrollbars>
		);
	}

	private renderAffiliationsTab(): React.ReactNode {
		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<div style={tabDivStyle}>
					<div style={tabDivStyle}>
						<b>Known Affiliations</b>
					</div>
					<CharacterAffiliations character={this.props.contact} />
				</div>
			</Scrollbars>
		);
	}

	private renderBioTab(): React.ReactNode {
		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<div style={tabDivStyle}>
					<b>Bio</b>
				</div>
				<CharacterBio
					character={this.props.contact}
					heightInPixels={this.props.heightInPixels - 105}
				/>
			</Scrollbars>
		);
	}

	private renderNotesTab(): React.ReactNode {
		return <ContactNotes contact={this.props.contact} player={this.props.player} />;
	}

	private renderContactModal(): React.ReactNode {
		const scalar = 0.85;
		const maxWidth = scalar * window.innerWidth;
		const maxHeight = scalar * window.innerHeight;
		return (
			<Modal open={this.state.imageModal} onClose={() => this.toggleImageModal(false)}>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%, -50%)',
					}}
				>
					{renderContactImage(this.props.contact.name, {
						maxWidthInPixels: maxWidth,
						maxHeightInPixels: maxHeight,
						containerShape: ImageContainerShape.RoundedRectangle,
					})}
				</div>
			</Modal>
		);
	}
}
