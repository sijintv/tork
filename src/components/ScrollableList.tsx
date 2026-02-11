import React, { useState, useRef, useEffect } from 'react';
import { Box, useInput, Text } from 'ink';
import { useClick } from '../hooks/useClick.js';
import { DOMElement } from 'ink';
import Scrollbar from './Scrollbar.js';

interface ScrollableListProps<T> {
    items: T[];
    height?: number;
    onSelect?: (item: T, index: number) => void;
    onHighlight?: (item: T, index: number) => void;
    onToggle?: (item: T, index: number) => void;
    renderItem: (item: T, isSelected: boolean, index: number) => React.ReactNode;
    isActive?: boolean;
}

const ScrollableList = <T,>({ items, height = 10, onSelect, onHighlight, onToggle, renderItem, isActive = true }: ScrollableListProps<T>) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const ref = useRef<DOMElement>(null);

    // Viewport calculation
    // Keep selected item visible
    // Simple strategy: 
    // If selectedIndex < scrollTop, scrollTop = selectedIndex
    // If selectedIndex >= scrollTop + height, scrollTop = selectedIndex - height + 1

    const [scrollTop, setScrollTop] = useState(0);

    // Ensure selectedIndex is valid when items change
    useEffect(() => {
        if (items.length === 0) return;
        if (selectedIndex >= items.length) {
            setSelectedIndex(Math.max(0, items.length - 1));
        }
    }, [items.length]);

    const lastHighlightedItemRef = useRef<T | undefined>(undefined);

    // Trigger onHighlight
    useEffect(() => {
        const currentItem = items[selectedIndex];
        if (onHighlight && currentItem) {
            // Check if item content is same to prevent infinite loops if items reference is unstable
            const isSame = lastHighlightedItemRef.current === currentItem ||
                JSON.stringify(lastHighlightedItemRef.current) === JSON.stringify(currentItem);

            if (!isSame) {
                lastHighlightedItemRef.current = currentItem;
                onHighlight(currentItem, selectedIndex);
            }
        }
    }, [selectedIndex, items, onHighlight]);

    useEffect(() => {
        if (selectedIndex < scrollTop) {
            setScrollTop(selectedIndex);
        } else if (selectedIndex >= scrollTop + height) {
            setScrollTop(selectedIndex - height + 1);
        }
    }, [selectedIndex, height, scrollTop]);

    useInput((input, key) => {
        if (!isActive) return;

        if (key.downArrow) {
            setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        }
        if (key.upArrow) {
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        }
        if (key.return && onSelect) {
            onSelect(items[selectedIndex], selectedIndex);
        }
        if (input === ' ' && onToggle) {
            onToggle(items[selectedIndex], selectedIndex);
        }
    });

    useClick(ref, ({ y }) => {
        // Allow selection via click even if not active (let parent handle focus switch)
        const index = scrollTop + y;
        if (index >= 0 && index < items.length) {
            setSelectedIndex(index);
            if (onSelect) onSelect(items[index], index);
        }
    });

    const visibleItems = items.slice(scrollTop, scrollTop + height);

    return (
        <Box ref={ref} flexDirection="row" height={height}>
            <Box flexDirection="column" flexGrow={1}>
                {visibleItems.map((item, i) => {
                    const realIndex = scrollTop + i;
                    const isSelected = realIndex === selectedIndex;
                    return (
                        <Box key={realIndex} flexShrink={0}>
                            {renderItem(item, isSelected, realIndex)}
                        </Box>
                    );
                })}
                {Array.from({ length: Math.max(0, height - visibleItems.length) }).map((_, i) => (
                    <Box key={`empty-${i}`}>
                        <Text> </Text>
                    </Box>
                ))}
            </Box>
            {items.length > height && (
                <Scrollbar
                    viewportHeight={height}
                    totalHeight={items.length}
                    scrollTop={scrollTop}
                />
            )}
        </Box>
    );
};

export default ScrollableList;
