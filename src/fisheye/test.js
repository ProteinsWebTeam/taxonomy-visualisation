import applyFishEye from '.';

describe('FishEye', () => {
  const tree = {
    x: 100,
    y: 100,
    children: [{ x: 101, y: 99 }, { x: 101, y: 100 }, { x: 101, y: 101 }],
  };
  let global = {};
  let treeCopy = {};

  beforeEach(() => {
    treeCopy = JSON.parse(JSON.stringify(tree));
    global = {
      enableFisheye: true,
      root: treeCopy,
      focused: treeCopy.children[1],
    };
  });

  test('if disabled, the tree does not change', () => {
    global.enableFisheye = false;
    applyFishEye(global);
    expect(tree).toEqual(treeCopy);
  });
  test('if enable, the tree changes', () => {
    applyFishEye(global);
    expect(tree).not.toEqual(treeCopy);
    expect(treeCopy).toMatchSnapshot();
  });
  test('if focused is root, the tree does not changes', () => {
    global.focused = global.root;
    applyFishEye(global);
    expect(tree).toEqual(treeCopy);
  });
});
