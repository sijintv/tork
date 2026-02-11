import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { getGraphLog } from '../git.js';
import ScrollableList from './ScrollableList.js';
import { useWindowSize } from '../hooks/useWindowSize.js';

import sliceAnsi from 'slice-ansi';
import stringWidth from 'string-width';

interface CommitListProps {
    isActive: boolean;
    onSelectCommit: (hash: string) => void;
}

const CommitList: React.FC<CommitListProps> = ({ isActive, onSelectCommit }) => {
    const [lines, setLines] = useState<string[]>([]);
    const { rows, columns } = useWindowSize(); // Get columns

    // Sidebar width is 35. Border is 2. Scrollbar might be 1.
    // Let's safe-guard with a bit more padding.
    const availableWidth = Math.max(0, columns - 42);

    useEffect(() => {
        const fetchLog = async () => {
            const log = await getGraphLog();
            setLines(log.split('\n'));
        };
        fetchLog();
    }, []);

    const handleSelect = (line: string, index: number) => {
        // Parse hash if needed
    };

    return (
        <Box flexDirection="column" borderStyle="single" borderColor={isActive ? "green" : "white"} flexGrow={1}>
            <Text bold>Commit History (Graph)</Text>
            <ScrollableList<string>
                items={lines}
                isActive={isActive}
                onSelect={handleSelect}
                height={rows ? Math.max(2, rows - 9) : 10}
                renderItem={(item, isSelected) => {
                    // Manually truncate to avoid Ink's wrapping issues with complex ANSI codes
                    let content = item;
                    if (stringWidth(item) > availableWidth) {
                        content = sliceAnsi(item, 0, availableWidth - 1) + '…';
                    }

                    return (
                        <Box width={availableWidth}>
                            <Text
                                backgroundColor={isSelected ? 'blue' : undefined}
                                wrap="truncate"
                            >
                                {content}
                            </Text>
                        </Box>
                    );
                }}
            />
        </Box>
    );
};

export default CommitList;
