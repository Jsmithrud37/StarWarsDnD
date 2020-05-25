import React from 'react';
import { render } from '@testing-library/react';
import App from '../apps/App';

test('renders learn react link', () => {
	const { getByText } = render(<App />);
	const linkElement = getByText(/Datapad/i);
	expect(linkElement).toBeInTheDocument();
});