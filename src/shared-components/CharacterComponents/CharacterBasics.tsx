import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { Character, isDroid } from '../../characters';
import { renderHomeworldLink, renderSpeciesLink } from '../CharacterUtilities';

export interface CharacterBasicsProps {
	character: Character;
}

export class CharacterBasics extends React.Component<CharacterBasicsProps> {
	public constructor(props: CharacterBasicsProps) {
		super(props);
	}

	public render(): React.ReactNode {
		return (
			<Table>
				<TableBody>
					{this.renderSpecies(this.props.character)}
					{this.renderGender(this.props.character)}
					{this.renderHomeworld(this.props.character)}
					{this.renderStatus(this.props.character)}
				</TableBody>
			</Table>
		);
	}

	private renderSpecies(character: Character): React.ReactNode {
		return (
			<TableRow>
				<TableCell>
					<b>Species: </b>
				</TableCell>
				<TableCell>{renderSpeciesLink(character)}</TableCell>
			</TableRow>
		);
	}

	private renderGender(character: Character): React.ReactNode {
		// If the contact is a droid, then it does not display gender information
		if (isDroid(character)) {
			return <></>;
		}
		return (
			<TableRow>
				<TableCell>
					<b>Gender: </b>
				</TableCell>
				<TableCell>{this.stringOrUnknown(character.gender)}</TableCell>
			</TableRow>
		);
	}

	private renderHomeworld(character: Character): React.ReactNode {
		return (
			<TableRow>
				<TableCell>
					<b>Homeworld: </b>
				</TableCell>
				<TableCell>{renderHomeworldLink(character)}</TableCell>
			</TableRow>
		);
	}

	private renderStatus(character: Character): React.ReactNode {
		return (
			<TableRow>
				<TableCell>
					<b>Status: </b>
				</TableCell>
				<TableCell>{this.stringOrUnknown(character.status)}</TableCell>
			</TableRow>
		);
	}

	private stringOrUnknown(value: string | undefined): string {
		return value ?? 'Unkown';
	}
}
