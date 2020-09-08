/**
 * Calendar related values
 * See: <https://starwars.fandom.com/wiki/Galactic_Standard_Calendar>
 */

/**
 * Days per year in the Galactic Standard Calendar..
 */
export const daysPerYear = 368;

/**
 * Days per month in the Galactic Standard Calendar.
 */
export const daysPerMonth = 35;

/**
 * Days per week in the Galactic Standard Calendar.
 */
export const daysPerWeek = 5;

/**
 * Weeks per month in the Galactic Standard Calendar.
 */
export const weeksPerMonth = daysPerMonth / daysPerWeek;

/**
 * Weeks in a Galactic Standard Year.
 * Does not account for the 3 festival weeks or the other 3 holidays.
 */
export const monthsPerYear = 10;

/**
 * Days of the week. Applies to the first 365 days of the year.
 */
export const weekDays = ['Primeday', 'Centaxday', 'Taungsday', 'Zhellday', 'Benduday'];

/**
 * Represents a calendar date in the Galactic Standard Calendar.
 */
export class Date {
	/**
	 * Year BBY. Must be an integer  on [0, ∞).
	 */
	public readonly year: number;

	/**
	 * Day of the year. Must be an integer on [0, {@link daysPerYear}).
	 */
	public readonly day: number;

	public constructor(year: number, day: number) {
		if (!Number.isInteger(year) || year < 0) {
			throw new Error('year must be an integer on [0, ∞).');
		}

		if (!Number.isInteger(day) || day < 0 || day >= daysPerYear) {
			throw new Error(`'day' must be an integer on [0, ${daysPerYear})`);
		}

		this.year = year;
		this.day = day;
	}

	// TODO: Fancier representation
	// TODO: handle holiday weeks
	public toString(): string {
		return `${this.year}/${this.day}`;
	}

	public compareWith(other: Date): number {
		// Since years are expressed in BBY, invert comparison
		const yearCompare = other.year - this.year;
		if (yearCompare !== 0) {
			return yearCompare;
		}

		return this.day - other.day;
	}
}
