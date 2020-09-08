import { TimelineEvent } from '../TimelineEvent';

/**
 * Dispatch ID for the LoadEvents action
 */
export const LOAD_EVENTS = 'LOAD_EVENTS';

/**
 * Typed dispatch ID for the LoadEvents action
 */
export type LOAD_EVENTS = typeof LOAD_EVENTS;

/**
 * LoadEvents action interface
 */
export interface LoadEvents {
	type: LOAD_EVENTS;
	events: TimelineEvent[];
}

/**
 * LoadEvents {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function loadEvents(events: TimelineEvent[]): LoadEvents {
	return {
		type: LOAD_EVENTS,
		events,
	};
}

/**
 * Loads timeline events.
 */
export type LoadEventsFunction = (events: TimelineEvent[]) => void;
