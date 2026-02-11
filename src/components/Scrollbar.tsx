import React from 'react';
import { Box, Text } from 'ink';

interface ScrollbarProps {
    viewportHeight: number;
    totalHeight: number;
    scrollTop: number; // Index of the top visible item
}

const Scrollbar: React.FC<ScrollbarProps> = ({ viewportHeight, totalHeight, scrollTop }) => {
    if (totalHeight <= viewportHeight) return null;

    const scrollbarHeight = Math.max(1, Math.floor((viewportHeight / totalHeight) * viewportHeight));
    const scrollbarTop = Math.floor((scrollTop / totalHeight) * viewportHeight);

    // Ensure scrollbar is within bounds
    const validTop = Math.min(scrollbarTop, viewportHeight - scrollbarHeight);

    return (
        <Box flexDirection="column" height={viewportHeight} width={1} marginLeft={1}>
            {Array.from({ length: viewportHeight }).map((_, i) => {
                const isThumb = i >= validTop && i < validTop + scrollbarHeight;
                return (
                    <Text key={i} color={isThumb ? 'cyan' : 'gray'}>
                        {isThumb ? '█' : '│'}
                    </Text>
                );
            })}
        </Box>
    );
};

export default Scrollbar;
