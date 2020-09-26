/**
 * Calendar related values
 * See: <https://starwars.fandom.com/wiki/Galactic_Standard_Calendar>
 */

// TODO: don't use BBY for years. Come up with some event earlier to be counting forward from.

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
 * Days of the week. Applies to the first 365 days of the year (for simplicity, I have put the
 * 3 extra holidays at the end of the year)
 */
export const weekDays = ['Primeday', 'Centaxday', 'Taungsday', 'Zhellday', 'Benduday'];

/**
 * Festival "weeks" celebrated in the galaxy
 */
export enum Festival {
	/**
	 * 5 days - first week of the year
	 */
	FeteWeek = 'Fete Week',

	/**
	 * 5 days - falls between months 6 and 7
	 */
	FestivalOfLife = 'Festival of Life',

	/**
	 * 5 days - falls between months 9 and 10
	 */
	FestivalOfStars = 'Festival of Stars',

	/**
	 * 3 days - last 3 days of the year
	 */
	YearsEndFestival = "Year's End Festival",
}

/**
 * Throws if the provided day (0-based) is not an integer, or if it is outside the allowed range.
 */
function validateDay(day: number): void {
	if (!Number.isInteger(day)) {
		throw new Error(`Expected an integer, received: ${day}`);
	}
	if (day < 0 || day >= daysPerYear) {
		throw new Error(
			`Provided day is outside the allowed range. Expected on [0, ${
				daysPerYear - 1
			}], but was: ${day}`,
		);
	}
}

/**
 * Gets the weekday name for the provided day of the year (0-based).
 */
export function weekdayFromDay(day: number): string {
	validateDay(day);

	// The 3-day week at the end of the year will report the first 3 weekdays,
	// which is probably fine.
	return weekDays[day % 5];
}

/**
 * Gets the numeric week of the year from the provided day of the year (0-based).
 */
export function weekFromDay(day: number): number {
	validateDay(day);

	// Since the 3-day week is at the end of the year, this works
	return Math.floor(day / daysPerWeek);
}

interface MonthData {
	/**
	 * Either the Month number (since I don't have names for them, 1-based) or the name of the
	 * Festival Week, if the date falls in one.
	 */
	monthOrFestivalWeek: number | Festival;

	/**
	 * Day of the month (1-based)
	 */
	dayOfMonthOrWeek: number;
}

/**
 * Returns the month or festival the provided day of the year lies within (0-based).
 */
function monthOrFestivalFromDay(day: number): MonthData {
	validateDay(day);

	const week = weekFromDay(day);

	const feteWeek = 0;
	const festivalOfLife = 1 + 6 * weeksPerMonth; // 1st holiday week + 6 months
	const festivalOfStars = 2 + 9 * weeksPerMonth; // 2 holiday weeks + 9 months
	const yearsEndFestival = 3 + 10 * weeksPerMonth; // 3 holiday weeks + 10 months

	if (week === feteWeek) {
		return {
			monthOrFestivalWeek: Festival.FeteWeek,
			dayOfMonthOrWeek: day + 1, // first week (1-based)
		};
	}
	if (week < festivalOfLife) {
		const month = Math.floor((week - 1) / weeksPerMonth);

		// Accounts for 1 holiday week
		const dayOfMonth = day - daysPerWeek - month * daysPerMonth;
		return {
			monthOrFestivalWeek: month + 1,
			dayOfMonthOrWeek: dayOfMonth + 1,
		};
	}
	if (week === festivalOfLife) {
		return {
			monthOrFestivalWeek: Festival.FestivalOfLife,
			dayOfMonthOrWeek: (day % daysPerWeek) + 1,
		};
	}
	if (week < festivalOfStars) {
		const month = Math.floor((week - 2) / weeksPerMonth);

		// Accounts for 2 holiday weeks
		const dayOfMonth = day - 2 * daysPerWeek - month * daysPerMonth;
		return {
			monthOrFestivalWeek: month + 1,
			dayOfMonthOrWeek: dayOfMonth + 1,
		};
	}
	if (week === festivalOfStars) {
		return {
			monthOrFestivalWeek: Festival.FestivalOfStars,
			dayOfMonthOrWeek: (day % daysPerWeek) + 1,
		};
	}
	if (week < yearsEndFestival) {
		const month = Math.floor((week - 2) / weeksPerMonth);

		// Accounts for 3 holiday weeks
		const dayOfMonth = day - 3 * daysPerWeek - month * daysPerMonth;
		return {
			monthOrFestivalWeek: month + 1,
			dayOfMonthOrWeek: dayOfMonth + 1,
		};
	}
	return {
		monthOrFestivalWeek: Festival.YearsEndFestival,
		dayOfMonthOrWeek: (day % daysPerWeek) + 1, // Will always be on [1,3]
	};
}

/**
 * Represents a calendar date in the Galactic Standard Calendar.
 */
export class Date {
	/**
	 * Year BBY. Must be an integer  on [0, ∞).
	 */
	public readonly year: number;

	/**
	 * Day of the year. Must be an integer on [0, {@link daysPerYear} - 1].
	 */
	public readonly dayOfTheYear: number;

	/**
	 * Name of the day of the week.
	 */
	public readonly weekday: string;

	/**
	 * <month-or-festival-shorthand>/<day-of-the-month>/<year>
	 */
	public readonly shortRepresentation: string;

	/**
	 * <weekday, ><month-or-festival>/<day>/<year>BBY
	 */
	public readonly longRepresentation: string;

	public constructor(year: number, day: number) {
		if (!Number.isInteger(year) || year < 0) {
			throw new Error('year must be an integer on [0, ∞).');
		}
		validateDay(day);

		this.year = year;
		this.dayOfTheYear = day;

		this.weekday = weekdayFromDay(day);
		const { monthOrFestivalWeek, dayOfMonthOrWeek } = monthOrFestivalFromDay(day);

		const monthOrFestivalWeekString = monthOrFestivalWeek.toLocaleString('en', {
			minimumIntegerDigits: 2,
		});

		const dayOfMonthOrWeekString = dayOfMonthOrWeek.toLocaleString('en', {
			minimumIntegerDigits: 2,
		});

		const yearString = year.toLocaleString('en', {
			minimumIntegerDigits: 4,
		});

		this.shortRepresentation = `${monthOrFestivalWeekString}/${dayOfMonthOrWeekString}/${year}`; // TODO: festival week shorthand
		this.longRepresentation = `${this.weekday}, ${monthOrFestivalWeekString}/${dayOfMonthOrWeekString}/${year}`;
	}

	public compareWith(other: Date): number {
		// Since years are expressed in BBY, invert comparison
		const yearCompare = other.year - this.year;
		if (yearCompare !== 0) {
			return yearCompare;
		}

		return this.dayOfTheYear - other.dayOfTheYear;
	}
}
