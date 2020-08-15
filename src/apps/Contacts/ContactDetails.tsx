import { AppBar, Tab, Tabs } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import DescriptionIcon from '@material-ui/icons/Description';
import PeopleIcon from '@material-ui/icons/People';
import ReactMarkdown from 'react-markdown';
import SwipeableViews from 'react-swipeable-views';
import React from 'react';
import Table from 'react-bootstrap/Table';
import {
	ImageContainerShape,
	renderContactImage,
	renderFactionEmblem,
} from '../../utilities/ImageUtilities';
import { Contact, isDroid } from './Contact';
import { Scrollbars } from 'react-custom-scrollbars';
import './Styling/Contacts.css';

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

		const hasAffiliations: boolean =
			contact.affiliations !== undefined && contact.affiliations.length > 0;
		const hasBio: boolean = contact.bio !== undefined;

		const basicsTab = this.renderBasicsTab(contact);
		const affiliationsTab = hasAffiliations ? (
			this.renderAffiliationsTab(contact.affiliations as string[])
		) : (
			<></>
		);
		const bioTab = hasBio ? this.renderBioTab(contact.bio as string) : <></>;

		const heightInPixels = 450;
		const headerHeightInPixels = 48; // Seems to match the height of the buttons
		const bodyHeightInPixels = heightInPixels - headerHeightInPixels;

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
		];

		if (hasAffiliations) {
			tabPanels.push(
				<TabPanel value={stringFromTabType(DetailsTab.Affiliations)} style={tabPanelStyle}>
					{affiliationsTab}
				</TabPanel>,
			);
		}

		if (hasBio) {
			tabPanels.push(
				<TabPanel value={stringFromTabType(DetailsTab.Bio)} style={tabPanelStyle}>
					{bioTab}
				</TabPanel>,
			);
		}

		return (
			<div
				style={{
					maxHeight: `${heightInPixels}px`,
				}}
			>
				<TabContext value={stringFromTabType(this.state.selectedTab)}>
					<AppBar
						color="default"
						position="static"
						style={{
							height: `${headerHeightInPixels}px`,
						}}
					>
						<Tabs
							centered
							indicatorColor="secondary"
							variant="fullWidth"
							onChange={(event, newSelection) => this.onTabSelection(newSelection)}
						>
							<Tab
								label={<PersonIcon />}
								color="inherit"
								value={DetailsTab.GeneralInfo}
							/>
							<Tab
								label={
									<PeopleIcon color={hasAffiliations ? 'inherit' : 'disabled'} />
								}
								value={DetailsTab.Affiliations}
								disabled={!hasAffiliations}
							/>
							<Tab
								label={<DescriptionIcon color={hasBio ? 'inherit' : 'disabled'} />}
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
				<Table variant="dark">
					{this.renderSpecies(contact)}
					{this.renderGender(contact)}
					{this.renderHomeworld(contact)}
					{this.renderStatus(contact)}
				</Table>
			</Scrollbars>
		);
	}

	private renderAffiliationsTab(affiliations: string[]): React.ReactNode {
		const divStyle = {
			width: '100%',
			padding: '10px',
		};

		const affiliationEntries = affiliations.map((affiliation) => {
			const affilliationImage = this.renderFactionImage(affiliation, 30);
			return (
				<tr key={affiliation}>
					<td>{affiliation}</td>
					<td>{affilliationImage}</td>
				</tr>
			);
		});

		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<div style={divStyle}>
					<div style={divStyle}>
						<b>Known Affiliation</b>
					</div>
					<Table variant="dark">{affiliationEntries}</Table>
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
			<tr>
				<td>
					<b>Species: </b>
				</td>
				<td>
					{contact.species ? (
						<a href={speciesLink} target="_blank" rel="noopener noreferrer">
							{contact.species}
						</a>
					) : (
						'Unkown'
					)}
				</td>
			</tr>
		);
	}

	private renderGender(contact: Contact): React.ReactNode {
		// If the contact is a droid, then it does not display gender information
		if (isDroid(contact)) {
			return <></>;
		}
		return (
			<tr>
				<td>
					<b>Gender: </b>
				</td>
				<td>{this.stringOrUnknown(contact.gender)}</td>
			</tr>
		);
	}

	private renderHomeworld(contact: Contact): React.ReactNode {
		const homeworldLink = this.getPlanetLinkUrl(contact.homeworld);
		return (
			<tr>
				<td>
					<b>Homeworld: </b>
				</td>
				<td>
					{contact.homeworld ? (
						<a href={homeworldLink} target="_blank" rel="noopener noreferrer">
							{contact.homeworld}
						</a>
					) : (
						'Unkown'
					)}
				</td>
			</tr>
		);
	}

	private renderStatus(contact: Contact): React.ReactNode {
		return (
			<tr>
				<td>
					<b>Status: </b>
				</td>
				<td>{this.stringOrUnknown(contact.status)}</td>
			</tr>
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
