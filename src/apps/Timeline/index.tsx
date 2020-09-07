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
	TimelineOppositeContent,
} from '@material-ui/lab';
import { renderFactionEmblem, ImageContainerShape } from '../../utilities/ImageUtilities';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';

/**
 * Represents the data required to render a timeline element icon.
 */
interface Icon {
	imagePath: string;
	altText: string;
	backgroundColor: string;
}

interface TimelineEvent {
	title: string;
	date: string;
	description?: string;
	involvedFactions?: string[];
}

const testElements: TimelineEvent[] = [
	{
		title: 'Test',
		date: '1234-123',
		description: 'Test description',
		involvedFactions: ['Centran Alliance'],
	},
	{
		title: 'Test2',
		date: '1234-123',
		description:
			'Another test which itself has a description describing the content being described therin',
		involvedFactions: ['True Sith Empire'],
	},
];

/**
 * Timeline app.
 */
const TimelineApp: React.FC = () => {
	const elements = testElements.map((event) => renderTimelineElement(event));

	return (
		<Scrollbars
			style={{
				height: '100%',
				backgroundColor: background2,
			}}
			autoHide={true}
			autoHeight={false}
		>
			<Timeline align="alternate">{elements}</Timeline>
		</Scrollbars>
	);
};

/**
 * Renders a timeline element with the specified content and icon.
 */
function renderTimelineElement(event: TimelineEvent): React.ReactNode {
	const iconSizeInPixels = 40;

	const hasInvolvedFactions = (event.involvedFactions?.length ?? 0) !== 0;
	const factionImage = hasInvolvedFactions
		? renderFactionEmblem((event.involvedFactions as string[])[0], {
				displayHeightInPixels: iconSizeInPixels,
				containerShape: ImageContainerShape.RoundedRectangle,
		  })
		: React.Fragment;

	return (
		<TimelineItem key={`timeline-event-${event.title}`}>
			<TimelineOppositeContent>
				<Typography variant="body2" color="textSecondary">
					{event.date}
				</Typography>
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineDot
					color="inherit"
					style={{
						backgroundColor: background5,
					}}
				>
					<div
						style={{
							height: `${iconSizeInPixels}px`,
							width: `${iconSizeInPixels}px`,
						}}
					>
						{factionImage}
					</div>
				</TimelineDot>
				<TimelineConnector />
			</TimelineSeparator>
			<TimelineContent>
				<Paper
					elevation={3}
					style={{
						backgroundColor: background4,
						padding: '10px',
					}}
				>
					<Typography variant="h6" component="h1" align="center">
						{event.title}
					</Typography>
					{event.description ? (
						<Typography align="center">{event.description}</Typography>
					) : (
						React.Fragment
					)}
				</Paper>
			</TimelineContent>
		</TimelineItem>
	);
}

export default TimelineApp;
