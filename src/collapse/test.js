import collapse from '.';

test('Should collapse when passed valid trees', () => {
  const trees = [
    {},
    { children: [{}] },
    { children: [{}, {}] },
    { children: [{ children: [{}, {}] }, { children: [{}] }] },
  ];
  for (const tree of trees) {
    collapse(tree);
    expect(tree).toMatchSnapshot();
  }
});

test('Should fail when passed invalid trees', () => {
  const notTrees = [undefined, null, 1, 'string', []];
  for (const notTree of notTrees) {
    expect(() => collapse(notTree)).toThrow();
  }
});
