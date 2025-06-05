//树转数组
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
//数组转树
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
/**
 * 显示层级数据
 * @param tree {Array} 树数据
 * @param func {Function} 回调函数
 * @param key{String} 指定返回字段名称
 * @param path {Array} 路径数据
 * @returns {*[]|[]|*}
 */
export function treeFindPath(tree, func, key = "", path = []) {
  if (!tree) return [];
  for (const data of tree) {
    key === "" ? path.push(data) : path.push(data[key]);
    if (func(data)) return path;
    if (data.children && data.children.length) {
      const findChildren = treeFindPath(data.children, func, key, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}
