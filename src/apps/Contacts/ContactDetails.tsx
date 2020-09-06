import { AppBar, Tab, Tabs, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import DescriptionIcon from '@material-ui/icons/Description';
import PeopleIcon from '@material-ui/icons/People';
import ReactMarkdown from 'react-markdown';
import SwipeableViews from 'react-swipeable-views';
import React from 'react';
import {
	ImageContainerShape,
	renderContactImage,
	renderFactionEmblem,
} from '../../utilities/ImageUtilities';
import { Contact, isDroid } from './Contact';
import { Scrollbars } from 'react-custom-scrollbars';
import './Styling/Contacts.css';
import { background4 } from '../../Theming';

/**
 * Tabs in the contact card view
 */
enum DetailsTab {
	GeneralInfo,
	Affiliations,
	Bio,
}

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
		default:
			throw new Error(`Unrecognized DetailsTab value: ${tabType}`);
	}
}

export interface ContactCardProps {
	contact: Contact;
	heightInPixels: number;
}

interface State {
	selectedTab: DetailsTab;
}

export class ContactDetails extends React.Component<ContactCardProps, State> {
	public constructor(props: ContactCardProps) {
		super(props);
		this.state = {
			selectedTab: DetailsTab.GeneralInfo,
		};
	}

	onTabSelection(newSelection: DetailsTab): void {
		this.setState({
			...this.state,
			selectedTab: newSelection,
		});
	}

	public render(): React.ReactNode {
		const contact = this.props.contact;

		const hasBio: boolean = contact.bio !== undefined;

		const basicsTab = this.renderBasicsTab(contact);
		const affiliationsTab = this.renderAffiliationsTab(contact.affiliations as string[]);
		const bioTab = hasBio ? this.renderBioTab(contact.bio as string) : <></>;

		const headerHeightInPixels = 48; // Seems to match the height of the buttons
		const bodyHeightInPixels = this.props.heightInPixels - headerHeightInPixels;

		const tabPanelStyle = {
			height: `${bodyHeightInPixels}px`,
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
			hasBio ? (
				<TabPanel
					key={DetailsTab.Bio}
					value={stringFromTabType(DetailsTab.Bio)}
					style={tabPanelStyle}
				>
					{bioTab}
				</TabPanel>
			) : (
				<div style={tabPanelStyle} />
			),
		];
		return (
			<div
				style={{
					maxHeight: `${this.props.heightInPixels}px`,
				}}
			>
				<TabContext value={stringFromTabType(this.state.selectedTab)}>
					<AppBar
						position="static"
						style={{
							height: `${headerHeightInPixels}px`,
							backgroundColor: background4,
						}}
					>
						<Tabs
							centered
							indicatorColor="primary"
							variant="fullWidth"
							onChange={(event, newSelection) => this.onTabSelection(newSelection)}
						>
							<Tab
								label={<PersonIcon />}
								color="inherit"
								value={DetailsTab.GeneralInfo}
							/>
							<Tab
								label={<PeopleIcon color={'inherit'} />}
								color="inherit"
								value={DetailsTab.Affiliations}
							/>
							<Tab
								label={<DescriptionIcon color={hasBio ? 'inherit' : 'disabled'} />}
								color="inherit"
								value={DetailsTab.Bio}
								disabled={!hasBio}
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

	private renderBasicsTab(contact: Contact): React.ReactNode {
		const contactImage = renderContactImage(contact.name, {
			displayHeightInPixels: 150,
			containerShape: ImageContainerShape.RoundedRectangle,
		});

		const divStyle = {
			width: '100%',
			padding: '10px',
		};

		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<div style={divStyle}>{contactImage}</div>
				<Table>
					<TableBody>
						{this.renderSpecies(contact)}
						{this.renderGender(contact)}
						{this.renderHomeworld(contact)}
						{this.renderStatus(contact)}
					</TableBody>
				</Table>
			</Scrollbars>
		);
	}

	private renderAffiliationsTab(affiliations: string[]): React.ReactNode {
		const divStyle = {
			width: '100%',
			padding: '10px',
		};

		if (affiliations.length === 0) {
			return (
				<div style={divStyle}>
					<p>No known affiliations</p>
				</div>
			);
		}

		const affiliationEntries = affiliations.map((affiliation) => {
			const affilliationImage = this.renderFactionImage(affiliation, 30);
			return (
				<TableRow key={affiliation}>
					<TableCell align="left">{affiliation}</TableCell>
					<TableCell align="center">{affilliationImage}</TableCell>
				</TableRow>
			);
		});

		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<div style={divStyle}>
					<div style={divStyle}>
						<b>Known Affiliations</b>
					</div>
					<Table>
						<TableBody>{affiliationEntries}</TableBody>
					</Table>
				</div>
			</Scrollbars>
		);
	}

	private renderBioTab(bio: string): React.ReactNode {
		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<div
					style={{
						textAlign: 'left',
					}}
				>
					<ReactMarkdown source={bio} linkTarget="_blank" escapeHtml={false} />
				</div>
			</Scrollbars>
		);
	}

	private renderSpecies(contact: Contact): React.ReactNode {
		const speciesLink = this.getSpeciesLinkUrl(contact.species);
		return (
			<TableRow>
				<TableCell>
					<b>Species: </b>
				</TableCell>
				<TableCell>
					{contact.species ? (
						<a href={speciesLink} target="_blank" rel="noopener noreferrer">
							{contact.species}
						</a>
					) : (
						'Unkown'
					)}
				</TableCell>
			</TableRow>
		);
	}

	private renderGender(contact: Contact): React.ReactNode {
		// If the contact is a droid, then it does not display gender information
		if (isDroid(contact)) {
			return <></>;
		}
		return (
			<TableRow>
				<TableCell>
					<b>Gender: </b>
				</TableCell>
				<TableCell>{this.stringOrUnknown(contact.gender)}</TableCell>
			</TableRow>
		);
	}

	private renderHomeworld(contact: Contact): React.ReactNode {
		const homeworldLink = this.getPlanetLinkUrl(contact.homeworld);
		return (
			<TableRow>
				<TableCell>
					<b>Homeworld: </b>
				</TableCell>
				<TableCell>
					{contact.homeworld ? (
						<a href={homeworldLink} target="_blank" rel="noopener noreferrer">
							{contact.homeworld}
						</a>
					) : (
						'Unkown'
					)}
				</TableCell>
			</TableRow>
		);
	}

	private renderStatus(contact: Contact): React.ReactNode {
		return (
			<TableRow>
				<TableCell>
					<b>Status: </b>
				</TableCell>
				<TableCell>{this.stringOrUnknown(contact.status)}</TableCell>
			</TableRow>
		);
	}

	private getSpeciesLinkUrl(species: string | undefined): string | undefined {
		return species
			? `https://starwars.fandom.com/wiki/${species.replace(' ', '_')}`
			: undefined;
	}

	private getPlanetLinkUrl(planet: string | undefined): string | undefined {
		return planet ? `https://starwars.fandom.com/wiki/${planet.replace(' ', '_')}` : undefined;
	}

	private stringOrUnknown(value: string | undefined): string {
		return value ?? 'Unkown';
	}

	private renderFactionImage(
		factionName: string,
		displayHeightInPixels: number,
	): React.ReactNode {
		return renderFactionEmblem(factionName, {
			displayHeightInPixels,
			containerShape: ImageContainerShape.Rectangle,
		});
	}
}
