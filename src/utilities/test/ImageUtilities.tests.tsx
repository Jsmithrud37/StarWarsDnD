import { cleanName } from '../ImageUtilities';

test('cleanName - Correctly handles string with many spaces', () => {
	const input = 'Outer  Rim   ? Herbalists Guild!';

	const expected = 'Outer-Rim-Herbalists-Guild';
	const result = cleanName(input);
	expect(result).toEqual(expected);
});
