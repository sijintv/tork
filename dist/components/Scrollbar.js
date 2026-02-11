import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
const Scrollbar = ({ viewportHeight, totalHeight, scrollTop }) => {
    if (totalHeight <= viewportHeight)
        return null;
    const scrollbarHeight = Math.max(1, Math.floor((viewportHeight / totalHeight) * viewportHeight));
    const scrollbarTop = Math.floor((scrollTop / totalHeight) * viewportHeight);
    // Ensure scrollbar is within bounds
    const validTop = Math.min(scrollbarTop, viewportHeight - scrollbarHeight);
    return (_jsx(Box, { flexDirection: "column", height: viewportHeight, width: 1, marginLeft: 1, children: Array.from({ length: viewportHeight }).map((_, i) => {
            const isThumb = i >= validTop && i < validTop + scrollbarHeight;
            return (_jsx(Text, { color: isThumb ? 'cyan' : 'gray', children: isThumb ? '█' : '│' }, i));
        }) }));
};
export default Scrollbar;
