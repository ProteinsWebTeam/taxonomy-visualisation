export default (depthCounts, maxCount) => {
  for (const [depth, count] of depthCounts.entries()) {
    if (count > maxCount) return depth - 1;
  }
  return depthCounts.length - 1;
};
