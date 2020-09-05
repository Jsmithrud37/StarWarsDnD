/**
 * Type of content used by the DataEntry.
 */
export enum DataType {
	String,
	Boolean,
	Number,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DataEntry<T extends boolean | string | number = boolean | string | number> {
	/**
	 * Initial value for the form.
	 */
	public readonly initialValue: T | undefined;

	/**
	 * Form label
	 */
	public readonly label: string;

	/**
	 * Element ID for the dom.
	 */
	public readonly elementId: string;

	/**
	 * Indicates whether or not a value is required to be submitted for this entry.
	 */
	public readonly required: boolean;

	/**
	 * Constructor
	 * @param initialValue - {@inheritdoc DataEntry.initialValue}
	 * @param label - {@inheritdoc DataEntry.label}
	 * @param elementId - {@inheritdoc DataEntry.elementId} If not provided, will use `label`.
	 * @param required - {@inheritdoc DataEntry.required}.
	 */
	protected constructor(
		initialValue: T | undefined,
		label: string,
		elementId?: string,
		required = true,
	) {
		this.initialValue = initialValue;
		this.label = label;
		this.elementId = elementId ?? label;
		this.required = required;
	}

	/**
	 * Gets the type of data associated with this form type.
	 */
	public abstract dataType(): DataType;

	public abstract errorMessage(): string | undefined;

	/**
	 * Determines whether or not the provided value is a valid submission for this field.
	 */
	public abstract isValueValid(value: T | undefined): boolean;
}

/**
 * DataEntry for booleans.
 */
export class BooleanEntry extends DataEntry<boolean> {
	/**
	 * Constructor
	 * @param initialValue - {@inheritdoc DataEntry.initialValue}
	 * @param label - {@inheritdoc DataEntry.label}
	 * @param elementId - {@inheritdoc DataEntry.elementId}
	 */
	public constructor(initialValue: boolean, label: string, elementId?: string) {
		super(initialValue, label, elementId, true);
	}

	public dataType(): DataType {
		return DataType.Boolean;
	}

	public errorMessage(): undefined {
		return undefined;
	}

	public isValueValid(): boolean {
		return true;
	}
}

/**
 * DataEntry for numbers.
 */
export class NumberEntry extends DataEntry<number> {
	/**
	 * Minimal allowed value
	 */
	public readonly min: number;

	/**
	 * Maximal allowed value
	 */
	public readonly max: number;

	/**
	 * Whether or not non-integer types are allowed
	 */
	public readonly decimals: boolean;

	/**
	 * Constructor
	 * @param initialValue - {@inheritdoc DataEntry.initialValue}
	 * @param label - {@inheritdoc DataEntry.label}
	 * @param elementId - {@inheritdoc DataEntry.elementId}
	 * @param required - {@inheritdoc DataEntry.required}
	 * @param min - {@inheritdoc NumberEntry.min}
	 * @param max - {@inheritdoc NumberEntry.max}
	 * @param decimals - {@inheritdoc NumberEntry.decimals}
	 */
	public constructor(
		initialValue: number | undefined,
		label: string,
		elementId?: string,
		required = true,
		min?: number,
		max?: number,
		decimals = true,
	) {
		super(initialValue, label, elementId, required ?? true);
		this.min = min ?? Number.NEGATIVE_INFINITY;
		this.max = max ?? Number.POSITIVE_INFINITY;
		this.decimals = decimals;
	}

	public dataType(): DataType {
		return DataType.Number;
	}

	public errorMessage(): string {
		return `Value must be ${this.decimals ? '' : 'an integer '}on [${this.min}, ${this.max}]`;
	}

	public isValueValid(value: number | undefined): boolean {
		if (value === undefined) {
			return !this.required;
		}
		if (value < this.min) {
			return false;
		}
		if (value > this.max) {
			return false;
		}
		if (!this.decimals && !Number.isInteger(value)) {
			return false;
		}
		return true;
	}
}

/**
 * DataEntry for strings.
 */
export class StringEntry extends DataEntry<string> {
	public readonly multiLine: boolean;

	/**
	 * Constructor
	 * @param initialValue - {@inheritdoc DataEntry.initialValue}
	 * @param label - {@inheritdoc DataEntry.label}
	 * @param elementId - {@inheritdoc DataEntry.elementId}
	 * @param required - {@inheritdoc DataEntry.required}
	 * @param multiLine - Indicates that the entry form should allow for multiple lines.
	 */
	public constructor(
		initialValue: string,
		label: string,
		elementId?: string,
		required = true,
		multiLine = false,
	) {
		super(initialValue, label, elementId, required);
		this.multiLine = multiLine;
	}

	public dataType(): DataType {
		return DataType.String;
	}

	public errorMessage(): string | undefined {
		// Only invalid state is empty when empty is not permitted.
		if (!this.required) {
			return undefined;
		}
		return `Must not be empty`;
	}

	public isValueValid(value: string | undefined): boolean {
		return !this.required || (value?.length ?? 0) !== 0;
	}
}
