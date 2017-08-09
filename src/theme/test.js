import { colors } from '.';

test('Colors are valid colors', () => {
  for (const color of Object.values(colors)) {
    expect(color).toBeTruthy();
    expect(typeof color).toBe('string');
  }
});
