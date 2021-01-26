import { LoadEvents, LoadEventsFunction } from './LoadEvents';

/**
 * Collection of action interfaces used by the Timeline app component.
 */
export type TimelineActionTypes = LoadEvents;

/**
 * Collection of action functions supported by the Timeline app component.
 */
export interface Actions {
	/**
	 * {@inheritdoc LoadEventsFunction}
	 */
	loadEvents: LoadEventsFunction;
}
