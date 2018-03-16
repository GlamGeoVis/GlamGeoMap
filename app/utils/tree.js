// some helpers for dealing with trees

export const getLeaves = (node) => {
  // get the leaf nodes for node `node`
  if (!('c' in node)) {
    return [node];
  }
  return [].concat(...node.c.map(getLeaves));
};

export const flattenNode = (node) => {
  // flatten the node (ie. create an array of it and all its descendants)
  if (!('c' in node)) {
    return [node];
  }

  return [node].concat(...node.c.map(flattenNode));
};

export const getNodesForScale = (node, scale) => {
  // get the nodes that should show at timescale `scale`
  if (node.a <= scale || !node.c) {
    return [node];
  }
  return [].concat(...node.c.map((child) => getNodesForScale(child, scale)));
};
