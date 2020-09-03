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
	public readonly initialValue: T;

	/**
	 * Form label
	 */
	public readonly label: string;

	/**
	 * Element ID for the dom.
	 */
	public readonly elementId: string;

	/**
	 * Constructor
	 * @param initialValue - {@inheritdoc DataEntry.initialValue}
	 * @param label - {@inheritdoc DataEntry.label}
	 * @param elementId - {@inheritdoc DataEntry.elementId} If not provided, will use `label`.
	 */
	protected constructor(initialValue: T, label: string, elementId?: string) {
		this.initialValue = initialValue;
		this.label = label;
		this.elementId = elementId ?? label;
	}

	/**
	 * Gets the type of data associated with this form type.
	 */
	public abstract dataType(): DataType;

	public abstract errorMessage(): string | undefined;

	/**
	 * Determines whether or not the provided value is a valid submission for this field.
	 */
	public abstract isValueValid(value: T): boolean;
}

/**
 * DataEntry for booleans.
 */
export class BooleanEntry extends DataEntry<boolean> {
	public constructor(initialValue: boolean, label: string, elementId?: string) {
		super(initialValue, label, elementId);
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
	public readonly min: number;
	public readonly max: number;
	public readonly decimals: boolean;

	// TODO: only ints?
	public constructor(
		initialValue: number,
		label: string,
		elementId?: string,
		min?: number,
		max?: number,
		decimals = true,
	) {
		super(initialValue, label, elementId);
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

	public isValueValid(value: number): boolean {
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
	public readonly canBeEmpty: boolean;
	public readonly multiLine: boolean;

	/**
	 * Constructor
	 * @param initialValue - See base constructor.
	 * @param label - See base constructor.
	 * @param elementId - See base constructor.
	 * @param canBeEmpty - Indicates whether or not an empty string is valid. Default is false.
	 * @param multiLine - Indicates that the entry form should allow for multiple lines.
	 * Default is false.
	 */
	public constructor(
		initialValue: string,
		label: string,
		elementId?: string,
		canBeEmpty = false,
		multiLine = false,
	) {
		super(initialValue, label, elementId);
		this.canBeEmpty = canBeEmpty;
		this.multiLine = multiLine;
	}

	public dataType(): DataType {
		return DataType.String;
	}

	public errorMessage(): string | undefined {
		// Only invalid state is empty when empty is not permitted.
		if (this.canBeEmpty) {
			return undefined;
		}
		return `Must not be empty`;
	}

	public isValueValid(value: string): boolean {
		if (!this.canBeEmpty && value.length === 0) {
			return false;
		}
		return true;
	}
}
