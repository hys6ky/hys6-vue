export function getFlatArr(arr) {
  return arr.reduce((val, item) => {
    let flatArr = [...val, item];

    // 可以在此处限制各种需要的条件，在展示字段前加空格，——之类的，以及其它情况

    if (item.children) {
      flatArr = [...flatArr, ...getFlatArr(item.children)];
    }
    return flatArr;
  }, []);
}

export function parseSimpleTreeData(treeData, id, pId, rootPId = null) {
  const keyNodes = {};
  const rootNodeList = [];
  // Fill in the map
  const nodeList = treeData.map((node) => {
    const clone = { ...node };
    const key = clone[id];
    keyNodes[key] = clone;
    clone.key = clone.key || key;
    return clone;
  });
  // Connect tree
  nodeList.forEach((node) => {
    const parentKey = node[pId];
    const parent = keyNodes[parentKey];
    if (parent) {
      // Fill parent
      parent.children = parent.children || [];
      parent.children.push(node);
    }
    // Fill root tree node
    if (parentKey === rootPId || (!parent && rootPId === null)) {
      rootNodeList.push(node);
    }
  });
  return rootNodeList;
}
