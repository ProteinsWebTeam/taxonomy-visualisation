import hierarchy from '.';

const rawData = {
  id: 1,
  children: [
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
      children: [
        {
          id: 5,
        },
      ],
    },
  ],
};

describe('sibling method', () => {
  let root;
  let nodes;
  beforeAll(() => {
    root = hierarchy(rawData);
    nodes = root.descendants();
  });

  test('hierarchy prototype should have been modified', () => {
    expect(hierarchy.prototype.sibling).toBeInstanceOf(Function);
    expect(root.sibling).toBeInstanceOf(Function);
  });

  test('sibling should work the expected way', () => {
    expect(root.sibling(1)).toBeNull();
    const two = nodes.find(n => n.data.id === 2);
    const three = nodes.find(n => n.data.id === 3);
    const four = nodes.find(n => n.data.id === 4);
    const five = nodes.find(n => n.data.id === 5);
    expect(two.sibling(0)).toBe(two);
    expect(two.sibling(3)).toBe(two);
    expect(two.sibling(-1)).toBe(four);
    expect(two.sibling(1)).toBe(three);
    expect(five.sibling(1)).toBe(five);
  });
});
