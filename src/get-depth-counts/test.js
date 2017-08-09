import getDepthCounts from '.';

test('getDepthCount to return correct values', () => {
  const d0 = { depth: 0 };
  const d1 = { depth: 1 };
  const d2 = { depth: 2 };
  const d3 = { depth: 3 };
  const nodeSets = [
    [d0, d1, d1, d2, d2, d2, d3, d3, d3, d3],
    [d0, d1, d1, d2, d2, d2, d3],
    [d0, d1, d2, d3],
    [d0],
    [d0, d1, d1, d2, d2, d2, d2, d2, d3],
  ];
  for (const nodeSet of nodeSets) {
    expect(getDepthCounts(nodeSet)).toMatchSnapshot();
  }
});
