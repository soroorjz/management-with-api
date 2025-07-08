function buildOrgTree(data) {
// $&
// $&

  const nodeMap = {};
  data.forEach((item) => {
    const id = item.ExecutiveBodyId || item.executiveBodyId;
    const name = item.ExecutiveBodyName || item.executiveBodyName || "نامشخص";
    const parent = item.ExecutiveBodyParent || item.executiveBodyParent;
    nodeMap[id] = {
      id,
      name,
      parent,
      image: item.ExecutiveBodyLogo || item.executiveBodyLogo || null,
      subCount: null, // فعلاً null چون داده‌ای نداریم
      activities: null, // فعلاً null چون داده‌ای نداریم
      children: [],
      // حفظ بقیه فیلدها
      ExecutiveBodyProvince:
        item.ExecutiveBodyProvince || item.executiveBodyProvince,
      ExecutiveBodyCountey:
        item.ExecutiveBodyCountey || item.executiveBodyCountey,
      ExecutiveBodyPlace: item.ExecutiveBodyPlace || item.executiveBodyPlace,
    };
// $&
  });

  const tree = [];
  Object.values(nodeMap).forEach((node) => {
    if (
      node.parent === null ||
      !nodeMap[node.parent] ||
      node.id === node.parent
    ) {
      tree.push(node);
    } else {
      nodeMap[node.parent].children.push(node);
    }
  });

// $&
  return tree;
}

export default buildOrgTree;
