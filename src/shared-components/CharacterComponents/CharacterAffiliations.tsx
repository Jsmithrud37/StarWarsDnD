import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { Character } from '../../characters';
import { ImageContainerShape, renderFactionEmblem } from '../../utilities/ImageUtilities';

export interface CharacterAffiliationsProps {
	character: Character;
}

const divStyle = {
	width: '100%',
	padding: '10px',
};

export class CharacterAffiliations extends React.Component<CharacterAffiliationsProps> {
	public constructor(props: CharacterAffiliationsProps) {
		super(props);
	}

	public render(): React.ReactNode {
		const affiliations = this.props.character.affiliations;
		if (!affiliations || affiliations.length === 0) {
			return this.renderNoAffiliations();
		}
		return this.renderAffiliations(affiliations);
	}

	private renderAffiliations(affiliations: string[]): React.ReactElement {
		const affiliationEntries = affiliations.map((affiliation) => {
			const affilliationImage = renderFactionEmblem(affiliation, {
				maxWidthInPixels: 30,
				maxHeightInPixels: 30,
				containerShape: ImageContainerShape.RoundedRectangle,
			});
			return (
				<TableRow key={affiliation}>
					<TableCell align="left">{affiliation}</TableCell>
					<TableCell align="center">{affilliationImage}</TableCell>
				</TableRow>
			);
		});
		return (
			<Table>
				<TableBody>{affiliationEntries}</TableBody>
			</Table>
		);
	}

	private renderNoAffiliations(): React.ReactElement {
		return (
			<div style={divStyle}>
				<p>No known affiliations</p>
			</div>
		);
	}
}
