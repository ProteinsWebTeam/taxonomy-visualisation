import getMaxDepth from '.';

test('getMaxDepth should return valid values', () => {
  const depthCountSets = [
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 50, 6],
    [1, 2, 20, 4, 50, 6],
    [1, 2],
    [1, 2, 100, 1000],
  ];
  const maxCounts = [1, 2, 10, 100];
  for (const depthCounts of depthCountSets) {
    for (const maxCount of maxCounts) {
      expect(getMaxDepth(depthCounts, maxCount)).toMatchSnapshot();
    }
  }
});
