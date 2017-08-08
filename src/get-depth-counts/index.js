export default nodes => {
  const depthCounts = [];
  for (const node of nodes) {
    depthCounts[node.depth] = (depthCounts[node.depth] || 0) + 1;
  }
  return depthCounts;
};
