import React from 'react';
import { background2, background4, background5 } from '../../Theming';
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
import { TimelineEvent } from './TimelineEvent';
import { connect } from 'react-redux';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { AppState } from './State';
import { Actions, loadEvents } from './Actions';
import LoadingScreen from '../../shared-components/LoadingScreen';
import { executeBackendFunction } from '../../utilities/NetlifyUtilities';
import { Card, Collapse, CardContent } from '@material-ui/core';
import { Id } from '../../utilities/DatabaseUtilities';
import { Date } from './Calendar';

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Shop {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

interface LocalState {
	sortAscending: boolean;
	selectedEvent?: Id;
}

class TimelineAppComponent extends React.Component<Props, LocalState> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			sortAscending: true,
			selectedEvent: undefined,
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
			const dateA = new Date(a.year, a.day);
			const dateB = new Date(b.year, b.day);
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
					<Timeline align="left">{renderedEvents}</Timeline>
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
		const iconSizeInPixels = 40;

		const hasInvolvedFactions = (timelineEvent.involvedFactions?.length ?? 0) !== 0;
		const factionImage = hasInvolvedFactions
			? renderFactionEmblem((timelineEvent.involvedFactions as string[])[0], {
					displayHeightInPixels: iconSizeInPixels,
					containerShape: ImageContainerShape.RoundedRectangle,
			  })
			: React.Fragment;

		const isSelected = timelineEvent._id === this.state.selectedEvent;
		const date = new Date(timelineEvent.year, timelineEvent.day);

		return (
			<TimelineItem key={`timeline-event-${timelineEvent.title}`}>
				<TimelineSeparator>
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
					<Typography variant="body2" color="textSecondary">
						{date.toString()}
					</Typography>
					<TimelineConnector />
				</TimelineSeparator>
				<TimelineContent>{this.renderEventCard(timelineEvent)}</TimelineContent>
			</TimelineItem>
		);
	}

	private renderEventCard(timelineEvent: TimelineEvent): React.ReactNode {
		const isSelected = timelineEvent._id === this.state.selectedEvent;

		return (
			<Card
				raised={isSelected}
				style={{
					minWidth: 250,
					maxWidth: 600,
					overflow: 'hidden',
					backgroundColor: background4,
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
					<div />

					<Typography variant="h6" align="center">
						{timelineEvent.title}
					</Typography>
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
							buttonWidth={30}
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
					<CardContent>
						<Typography align="left" paragraph>
							{timelineEvent.description}
						</Typography>
						<b>Location:</b>
						<Typography align="left">{timelineEvent.location}</Typography>
					</CardContent>
				</Collapse>
			</Card>
		);
	}
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
