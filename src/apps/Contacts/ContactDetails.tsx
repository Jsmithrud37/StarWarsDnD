import { AppBar, Grid, Tab, Tabs } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import ReactMarkdown from 'react-markdown';
import SwipeableViews from 'react-swipeable-views';
import React from 'react';
import Card from 'react-bootstrap/Card';
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
	Bio,
}

/**
 * Gets the string representation of the provided tab type
 */
function stringFromTabType(tabType: DetailsTab): string {
	switch (tabType) {
		case DetailsTab.GeneralInfo:
			return 'General Info';
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

		const basicsTab = this.renderBasicsTab(contact);
		const bioTab = contact.bio ? this.renderBioTab(contact.bio) : <></>;

		const heightInPixels = 450;
		const headerHeightInPixels = 48; // Seems to match the height of the buttons
		const bodyHeightInPixels = heightInPixels - headerHeightInPixels;

		return (
			<div
				style={{
					maxHeight: `${heightInPixels}px`,
				}}
			>
				<TabContext value={stringFromTabType(this.state.selectedTab)}>
					<AppBar
						position="static"
						style={{
							height: `${headerHeightInPixels}px`,
						}}
					>
						<Tabs
							centered
							indicatorColor="primary"
							variant="fullWidth"
							onChange={(event, newSelection) => this.onTabSelection(newSelection)}
						>
							<Tab
								label={stringFromTabType(DetailsTab.GeneralInfo)}
								value={DetailsTab.GeneralInfo}
							/>
							<Tab
								label={stringFromTabType(DetailsTab.Bio)}
								value={DetailsTab.Bio}
								disabled={contact.bio === undefined}
							/>
						</Tabs>
					</AppBar>
					<SwipeableViews
						axis="x"
						index={this.state.selectedTab}
						onChangeIndex={(event, newSelection) => this.onTabSelection(newSelection)}
					>
						<TabPanel
							value={stringFromTabType(DetailsTab.GeneralInfo)}
							style={{
								height: `${bodyHeightInPixels}px`,
							}}
						>
							{basicsTab}
						</TabPanel>
						<TabPanel
							value={stringFromTabType(DetailsTab.Bio)}
							style={{
								height: `${bodyHeightInPixels}px`,
							}}
						>
							{bioTab}
						</TabPanel>
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

		const itemStyle = {
			padding: 3,
		};

		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<Grid container justify="space-between">
					<Grid item style={itemStyle}>
						{contactImage}
					</Grid>
					<Grid item style={itemStyle}>
						{this.renderBasicDetails(contact)}
					</Grid>
					<Grid item style={itemStyle}>
						{this.renderAffilliations(contact)}
					</Grid>
				</Grid>
			</Scrollbars>
		);
	}

	private renderBioTab(bio: string): React.ReactNode {
		return (
			<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
				<ReactMarkdown source={bio} linkTarget="_blank" escapeHtml={false} />
			</Scrollbars>
		);
	}

	private renderBasicDetails(contact: Contact): React.ReactNode {
		return (
			<Card
				bg="dark"
				style={{
					minWidth: 100,
				}}
			>
				<Card.Body>
					<>
						{this.renderSpecies(contact)}
						{this.renderGender(contact)}
						{this.renderStatus(contact)}
					</>
				</Card.Body>
			</Card>
		);
	}

	private renderSpecies(contact: Contact): React.ReactNode {
		const speciesLink = this.getSpeciesLinkUrl(contact);
		return (
			<p>
				<b>Species: </b>
				{contact.species ? (
					<a href={speciesLink} target="_blank" rel="noopener noreferrer">
						{contact.species}
					</a>
				) : (
					'Unkown'
				)}
			</p>
		);
	}

	private renderGender(contact: Contact): React.ReactNode {
		// If the contact is a droid, then it does not
		if (isDroid(contact)) {
			return <></>;
		}
		return (
			<p>
				<b>Gender: </b>
				{this.stringOrUnknown(contact.gender)}
			</p>
		);
	}

	private renderStatus(contact: Contact): React.ReactNode {
		return (
			<p>
				<b>Status: </b>
				{this.stringOrUnknown(contact.status)}
			</p>
		);
	}

	private renderAffilliations(contact: Contact): React.ReactNode {
		let cardBody;
		if (contact.affiliations && contact.affiliations.length > 0) {
			const affiliationEntries = contact.affiliations.map((faction) => {
				const affilliationImage = this.renderFactionImage(faction, 30);
				return (
					<tr key={faction}>
						<td>{faction}</td>
						<td>{affilliationImage}</td>
					</tr>
				);
			});
			cardBody = (
				<Card.Body
					style={{
						padding: 5,
						minWidth: 200,
					}}
				>
					<b>Known Affiliations</b>
					<Table variant="dark">{affiliationEntries}</Table>
				</Card.Body>
			);
		} else {
			cardBody = (
				<Card.Body>
					<p>
						<b>Known Affiliations: </b>
						None
					</p>
				</Card.Body>
			);
		}

		return <Card bg="dark">{cardBody}</Card>;
	}

	private getSpeciesLinkUrl(contact: Contact): string | undefined {
		return contact.species
			? `https://starwars.fandom.com/wiki/${contact.species.replace(' ', '_')}`
			: undefined;
	}

	private stringOrUnknown(value: string | undefined): string {
		return value ?? 'unkown';
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
