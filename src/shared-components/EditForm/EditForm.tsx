import {
	Card,
	CardHeader,
	CardContent,
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	TextField,
} from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { BooleanEntry, DataEntry, DataType, NumberEntry, StringEntry } from './DataEntry';
import { background2 } from '../../Theming';

/**
 * Types representable in the form
 */
export type EntryTypes = boolean | string | number;

interface Props {
	title: string;
	schemas: Map<string, DataEntry>;
	onSubmit: (data: Map<string, EntryTypes>) => void;
	onCancel: () => void;
}

interface State {
	entries: Map<string, EntryTypes>;
	inErrorState: boolean;
}

/**
 * Form for editing data based on an input schema
 */
export class EditForm extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		const initialStateMap = new Map<string, EntryTypes>();
		props.schemas.forEach((value, key) => {
			initialStateMap.set(key, value.initialValue);
		});

		this.state = {
			entries: initialStateMap,
			inErrorState: false,
		};
	}

	private updateState(key: string, data: EntryTypes): void {
		const schema = this.props.schemas.get(key);

		if (!schema) {
			throw new Error(`Invalid state. No schema found for key: ${key}`);
		}

		const stateMap = new Map<string, EntryTypes>(this.state.entries);
		stateMap.set(key, data);
		this.setState({
			...this.state,
			entries: stateMap,
		});
	}

	// TODO: don't allow submit if nothing has changed
	private onSubmit(): void {
		let validState = true;
		this.props.schemas.forEach((schema, key) => {
			const state = this.state.entries.get(key);
			if (state === undefined) {
				return;
			}

			if (!schema.isValueValid(state)) {
				validState = false;
			}
		});

		if (validState) {
			this.props.onSubmit(this.state.entries);
		} else {
			this.setState({
				...this.state,
				inErrorState: true,
			});
		}
	}

	public render(): React.ReactNode {
		const childNodes: React.ReactNode[] = [];
		this.props.schemas.forEach((schema, key) => {
			const child = this.renderForm(key, schema);
			childNodes.push(
				<Grid item key={key}>
					{child}
				</Grid>,
			);
		});

		return (
			<Card
				style={{
					backgroundColor: background2,
				}}
			>
				<CardHeader>{this.props.title}</CardHeader>
				<CardContent>
					<Grid container spacing={3}>
						{childNodes}
					</Grid>
				</CardContent>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						padding: '15px',
					}}
				>
					<Button fullWidth={false} onClick={() => this.onSubmit()}>
						Submit
					</Button>
					<Button fullWidth={false} onClick={() => this.props.onCancel()}>
						Cancel
					</Button>
				</div>
			</Card>
		);
	}

	public renderForm(key: string, dataEntry: DataEntry): React.ReactNode {
		const dataType = dataEntry.dataType();
		const currentValue = this.state.entries.get(key);
		switch (dataType) {
			case DataType.Boolean:
				ensureType(currentValue, 'boolean');
				return this.renderBooleanForm(
					key,
					currentValue as boolean,
					dataEntry as BooleanEntry,
					(key, newValue) => this.updateState(key, newValue),
				);
			case DataType.Number:
				ensureType(currentValue, 'number');
				return this.renderNumberForm(
					key,
					currentValue as number,
					dataEntry as NumberEntry,
					(key, newValue) => this.updateState(key, newValue),
				);
			case DataType.String:
				ensureType(currentValue, 'string');
				return this.renderStringForm(
					key,
					currentValue as string,
					dataEntry as StringEntry,
					(key, newValue) => this.updateState(key, newValue),
				);
			default:
				throw new Error(`Unrecognized DataType: ${dataType}`);
		}
	}

	/**
	 * Renders a form for editing boolean values.
	 */
	public renderBooleanForm(
		key: string,
		currentValue: boolean,
		schema: BooleanEntry,
		onChange: (key: string, newValue: boolean) => void,
	): React.ReactNode {
		return (
			<FormControlLabel
				control={<Checkbox color="primary" checked={currentValue} />}
				label={schema.label}
				id={schema.elementId}
				onChange={(event: React.ChangeEvent<{}>, checked: boolean) =>
					onChange(key, checked)
				}
			/>
		);
	}

	/**
	 * Renders a form for editing number values.
	 */
	public renderNumberForm(
		key: string,
		currentValue: number,
		schema: NumberEntry,
		onUpdate: (key: string, newValue: number) => void,
	): React.ReactNode {
		const error = this.state.inErrorState ? !schema.isValueValid(currentValue) : false;
		const errorMessage = error ? schema.errorMessage() : undefined;
		return (
			<TextField
				defaultValue={currentValue}
				label={schema.label}
				id={schema.elementId}
				variant="outlined"
				color="primary"
				type="number"
				error={error}
				helperText={errorMessage}
				onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
					onUpdate(key, Number.parseFloat(event.target.value));
				}}
			/>
		);
	}

	/**
	 * Renders a form for editing string values.
	 */
	public renderStringForm(
		key: string,
		currentValue: string,
		schema: StringEntry,
		onUpdate: (key: string, newValue: string) => void,
	): React.ReactNode {
		const error = this.state.inErrorState ? !schema.isValueValid(currentValue) : false;
		const errorMessage = error ? schema.errorMessage() : undefined;
		return (
			<TextField
				defaultValue={currentValue}
				label={schema.label}
				id={schema.elementId}
				variant="outlined"
				multiline={schema.multiLine}
				error={error}
				helperText={errorMessage}
				onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
					onUpdate(key, event.target.value)
				}
			/>
		);
	}
}

/**
 * Ensures the provided value is of the specified type. Throws if this is not the case.
 */
function ensureType(value: unknown | undefined, expectedType: string): void {
	if (value === undefined) {
		return;
	}
	if (typeof value !== expectedType) {
		throw new Error(`Value was of type ${typeof value}. Expected ${expectedType}`);
	}
}
