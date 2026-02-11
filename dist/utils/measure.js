export const measureAbsolute = (node) => {
    if (!node || !node.yogaNode)
        return null;
    let x = 0;
    let y = 0;
    let currentNode = node;
    while (currentNode && currentNode.yogaNode) {
        x += currentNode.yogaNode.getComputedLeft();
        y += currentNode.yogaNode.getComputedTop();
        currentNode = currentNode.parentNode;
    }
    const width = node.yogaNode.getComputedWidth();
    const height = node.yogaNode.getComputedHeight();
    return {
        x,
        y,
        width,
        height,
        left: x,
        top: y,
        right: x + width,
        bottom: y + height
    };
};
