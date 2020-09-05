import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { background1 } from '../../Theming';

/**
 * Represents the data required to render a timeline element icon.
 */
interface Icon {
	imagePath: string;
	altText: string;
	backgroundColor: string;
}

const centranAllianceIcon: Icon = {
	imagePath: 'images/Centran-Alliance.png',
	altText: 'Centran Alliance',
	backgroundColor: 'grey',
};

const staveSquadIcon: Icon = {
	imagePath: 'images/Stave-Squad.png',
	altText: 'Stave Squad',
	backgroundColor: 'grey',
};

const empireIcon: Icon = {
	imagePath: 'images/True-Sith-Empire.png',
	altText: 'True Sith Empire',
	backgroundColor: 'red',
};

const republicIcon: Icon = {
	imagePath: 'images/Galactic-Republic.png',
	altText: 'Galactic Republic',
	backgroundColor: 'blue',
};

/**
 * Timeline app.
 */
const Timeline: React.FC = () => {
	return (
		<div
			style={{
				position: `relative`,
				width: `100%`,
				height: `100%`,
				overflow: `hidden`,
				backgroundColor: background1,
			}}
		>
			<VerticalTimeline>
				{timelineElement(
					'Centran Alliance Test',
					'Centran Base, Hutt Space',
					'Mock timeline event involving the Centran Alliance.',
					'Mock date 1',
					centranAllianceIcon,
				)}
				,
				{timelineElement(
					'Stave Squad Test',
					'Centran Base, Hutt Space',
					'Mock timeline event involving Stave Squad of the Centran Alliance.',
					'Mock date',
					staveSquadIcon,
				)}
				,
				{timelineElement(
					'Republic Test',
					'Coruscant, Core',
					'Mock timeline event involving the Galactic Republic.',
					'Mock date',
					republicIcon,
				)}
				,
				{timelineElement(
					'Empire Test',
					'Dromund Kaas, Outer Rim',
					'Mock timeline event involving the True Sith Empire.',
					'Mock date',
					empireIcon,
				)}
			</VerticalTimeline>
		</div>
	);
};

/**
 * Renders a timeline element with the specified content and icon.
 */
function timelineElement(
	heading: string,
	subHeading: string,
	content: string,
	date: string,
	icon: Icon,
): React.ReactNode {
	const iconSizeInPixels = 60;
	return (
		<VerticalTimelineElement
			className="vertical-timeline-element--work"
			contentStyle={{ background: 'light-grey', color: 'black' }}
			date={date}
			iconStyle={{
				background: icon.backgroundColor,
				height: `${iconSizeInPixels}px`,
				width: `${iconSizeInPixels}px`,
			}}
			icon={timelineElementIcon(icon, iconSizeInPixels)}
		>
			<h3 className="vertical-timeline-element-title">{heading}</h3>
			<h4 className="vertical-timeline-element-subtitle">{subHeading}</h4>
			<p>{content}</p>
		</VerticalTimelineElement>
	);
}

/**
 * Returns an image node with the Centran Alliance emblem image.
 */
function timelineElementIcon(icon: Icon, sizeInPixels: number): React.ReactNode {
	return (
		<div style={{ height: `${sizeInPixels}px`, width: `${sizeInPixels}px` }}>
			<img src={icon.imagePath} alt={icon.altText} height="100%" style={{ padding: '7px' }} />
		</div>
	);
}

export default Timeline;
