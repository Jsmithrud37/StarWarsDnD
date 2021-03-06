import React from 'react';
import { background2, background5, createContentColorForLevel } from '../../Theming';
import { Scrollbars } from 'react-custom-scrollbars';
import {
	Timeline,
	TimelineItem,
	TimelineSeparator,
	TimelineDot,
	TimelineConnector,
	TimelineContent,
} from '@material-ui/lab';
import { renderFactionEmblem, ImageContainerShape } from '../../utilities/ImageUtilities';
import Typography from '@material-ui/core/Typography/Typography';
import { getThemeColorForEvent, TimelineEvent } from './TimelineEvent';
import { connect } from 'react-redux';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { AppState } from './State';
import { Actions, loadEvents } from './Actions';
import LoadingScreen from '../../shared-components/LoadingScreen';
import { executeBackendFunction } from '../../utilities/NetlifyUtilities';
import { Card, Collapse, CardContent } from '@material-ui/core';
import { Id } from '../../utilities/DatabaseUtilities';
import { Date } from './Calendar';
import {
	ViewPortAwareComponent,
	ViewPortAwareState,
} from '../../shared-components/ViewPortAwareComponent';

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Shop {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

interface LocalState extends ViewPortAwareState {
	sortAscending: boolean;
	selectedEvent?: Id;
}

class TimelineAppComponent extends ViewPortAwareComponent<Props, LocalState> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			sortAscending: true,
			selectedEvent: undefined,
			viewportWidthInPixels: window.innerWidth,
			viewportHeightInPixels: window.innerHeight,
		};
	}

	private async fetchEvents(): Promise<void> {
		interface FetchEventsResult {
			events: TimelineEvent[];
		}

		const getInventoryFunction = 'GetTimelineEvents';
		const response = await executeBackendFunction<FetchEventsResult>(getInventoryFunction);

		if (response) {
			this.props.loadEvents(response.events);
		} else {
			throw new Error('Timeline fetch failed.');
		}
	}

	private getSortedEvents(): TimelineEvent[] {
		if (this.props.events === undefined) {
			throw new Error('Events not loaded yet.');
		}
		return this.props.events.sort((a, b) => {
			const dateA = getDate(a);
			const dateB = getDate(b);
			const compare = dateA.compareWith(dateB);
			return this.state.sortAscending ? compare : -compare;
		});
	}

	private selectEvent(event: TimelineEvent): void {
		this.setState({
			...this.state,
			selectedEvent: event._id,
		});
	}

	private deselectEvent(): void {
		this.setState({
			...this.state,
			selectedEvent: undefined,
		});
	}

	public render(): React.ReactNode {
		const useNarrowView = this.state.viewportWidthInPixels < 540;

		let view;
		if (this.props.events === undefined) {
			this.fetchEvents();
			view = <LoadingScreen text="Loading timeline..." />;
		} else {
			const sortedEvents = this.getSortedEvents();
			const renderedEvents = sortedEvents.map((event) => this.renderTimelineElement(event));
			view = (
				<Scrollbars
					autoHide={true}
					autoHeight={false}
					onClick={() => {
						// TODO: clicking on scroll bar should not deselect items
						this.deselectEvent();
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<div
							style={{
								maxWidth: '1000px',
							}}
						>
							<Timeline align={useNarrowView ? 'left' : 'alternate'}>
								{renderedEvents}
							</Timeline>
						</div>
					</div>
				</Scrollbars>
			);
		}

		return (
			<div
				style={{
					height: '100%',
					backgroundColor: background2,
				}}
			>
				{view}
			</div>
		);
	}

	/**
	 * Renders a timeline element with the specified content and icon.
	 */
	private renderTimelineElement(timelineEvent: TimelineEvent): React.ReactNode {
		return (
			<TimelineItem key={`timeline-event-${timelineEvent.title}`}>
				<TimelineSeparator>
					{this.renderEventNode(timelineEvent)}
					<TimelineConnector />
				</TimelineSeparator>
				<TimelineContent>{this.renderEventCard(timelineEvent)}</TimelineContent>
			</TimelineItem>
		);
	}

	private renderEventNode(timelineEvent: TimelineEvent): React.ReactNode {
		const iconSizeInPixels = 40;

		const hasInvolvedFactions = (timelineEvent.involvedFactions?.length ?? 0) !== 0;
		const factionImage = hasInvolvedFactions
			? renderFactionEmblem((timelineEvent.involvedFactions as string[])[0], {
					maxHeightInPixels: iconSizeInPixels,
					maxWidthInPixels: iconSizeInPixels,
					containerShape: ImageContainerShape.RoundedRectangle,
			  })
			: React.Fragment;

		const isSelected = timelineEvent._id === this.state.selectedEvent;
		const date = getDate(timelineEvent);

		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<TimelineDot
						color={isSelected ? 'inherit' : 'primary'}
						style={{
							backgroundColor: background5,
						}}
					>
						<div
							style={{
								height: `${iconSizeInPixels}px`,
								width: `${iconSizeInPixels}px`,
							}}
							onClick={(event) => {
								if (!isSelected) {
									this.selectEvent(timelineEvent);
								}
								// Ensures that deselect event capture on container
								// does not immediately deselect the contact.
								event.stopPropagation();
							}}
						>
							{factionImage}
						</div>
					</TimelineDot>
				</div>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Typography variant="body2" color="textSecondary">
						{date.shortRepresentation}
					</Typography>
				</div>
			</div>
		);
	}

	private renderEventCard(timelineEvent: TimelineEvent): React.ReactNode {
		const isSelected = timelineEvent._id === this.state.selectedEvent;

		return (
			<Card
				raised={isSelected}
				style={{
					minWidth: 250,
					// maxWidth: 600,
					overflow: 'hidden',
					backgroundColor: createContentColorForLevel(
						getThemeColorForEvent(timelineEvent),
						4,
					),
				}}
				onClick={(event) => {
					// Clicks on the card should not collapse the card.
					// Ensures that deselect event capture on container
					// does not immediately deselect the contact.
					event.stopPropagation();
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						padding: '5px',
					}}
				>
					<div style={{ height: '100%' }} />

					<div
						style={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-around',
						}}
					>
						<Typography variant="subtitle1" align="center">
							{timelineEvent.title}
						</Typography>
					</div>
					<div
						style={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-around',
							padding: '2px',
						}}
					>
						<HamburgerSqueeze
							barColor="white"
							buttonWidth={25}
							isActive={isSelected}
							toggleButton={
								isSelected
									? () => this.deselectEvent()
									: // eslint-disable-next-line @typescript-eslint/no-explicit-any
									  (event: any) => {
											// Ensures that deselect event capture on container
											// does not immediately deselect the contact.
											event.stopPropagation();
											this.selectEvent(timelineEvent);
									  }
							}
						/>
					</div>
				</div>
				<Collapse in={isSelected}>
					<CardContent
						style={{
							backgroundColor: createContentColorForLevel(
								getThemeColorForEvent(timelineEvent),
								3,
							),
						}}
					>
						{this.renderNotes(timelineEvent)}
						{this.renderLocation(timelineEvent)}
						{this.renderDate(timelineEvent)}
					</CardContent>
				</Collapse>
			</Card>
		);
	}

	private renderNotes(timelineEvent: TimelineEvent): React.ReactNode {
		return timelineEvent.description
			? this.renderEventData(timelineEvent.description)
			: React.Fragment;
	}

	private renderLocation(timelineEvent: TimelineEvent): React.ReactNode {
		return this.renderEventData(timelineEvent.location, 'Location');
	}

	private renderDate(timelineEvent: TimelineEvent): React.ReactNode {
		const date = getDate(timelineEvent);
		return this.renderEventData(`${date.longRepresentation} BBY`, 'Date');
	}

	private renderEventData(data: string, label?: string): React.ReactNode {
		return (
			<div
				style={{
					textAlign: 'left',
				}}
			>
				<p>
					{label ? <b>{label}: </b> : <></>}
					{data}
				</p>
			</div>
		);
	}
}

/**
 * Creates a Date from a {@link TimelineEvent}
 */
function getDate(event: TimelineEvent): Date {
	return new Date(event.year, event.day);
}

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): Parameters {
	return state;
}

/**
 * Timeline app.
 * Displays a timeline of events that have taken place in and around the campaign.
 */
const TimelineApp = connect(mapStateToProps, {
	loadEvents,
})(TimelineAppComponent);

export default TimelineApp;
